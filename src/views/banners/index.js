import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Space, Switch, Tabs, Typography, Tooltip, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setRefetch } from 'redux/slices/menu';
import bannerService from 'services/banner';
import { fetchBanners } from 'redux/slices/banner';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useDidUpdate from 'helpers/useDidUpdate';
import ColumnImage from 'components/column-image';
import getFullDateTime from 'helpers/getFullDateTime';
import tableRowClasses from 'assets/scss/components/table-row.module.scss';
import Card from 'components/card';
import OutlinedButton from 'components/outlined-button';
import RiveResult from 'components/rive-result';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const roles = ['published', 'deleted_at'];
const initialFilterValues = {
  status: 'published',
  page: 1,
  perPage: 10,
};

const tableStyles = `
.custom-banner-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border: none;
}
.custom-banner-table th, .custom-banner-table td {
  padding: 8px 8px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  vertical-align: middle;
}
.custom-banner-table th:first-child, .custom-banner-table td:first-child {
  text-align: center;
  width: 30px;
}
.dragging-row {
  background: #e6f7ff !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  display: table-row;
}

/* Responsive styles */
@media (max-width: 900px) {
  .custom-banner-table th, .custom-banner-table td {
    padding: 6px 4px;
    font-size: 13px;
  }
  .custom-banner-table th:nth-child(4),
  .custom-banner-table td:nth-child(4), /* image */
  .custom-banner-table th:nth-child(5),
  .custom-banner-table td:nth-child(5)  /* show_in */
  {
    display: none;
  }
}
@media (max-width: 600px) {
  .custom-banner-table th, .custom-banner-table td {
    padding: 4px 2px;
    font-size: 11px;
  }
  .custom-banner-table th:nth-child(7),
  .custom-banner-table td:nth-child(7), /* created_at */
  .custom-banner-table th:nth-child(8),
  .custom-banner-table td:nth-child(8)  /* options */
  {
    display: none;
  }
}
`;

const Banners = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { banners, meta, loading, params } = useSelector(
    (state) => state.banner,
    shallowEqual,
  );

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [filters, setFilters] = useState(initialFilterValues);
  const [bannersState, setBannersState] = useState([]);

  const columns = [
    {
      title: '',
      dataIndex: 'drag',
      key: 'drag',
      width: 30,
      className: 'drag-visible',
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
      onCell: () => ({
        className: 'drag-handle-cell',
      }),
    },
    {
      title: t('order'),
      dataIndex: 'order',
      key: 'order',
      width: 60,
      render: (order) => order || '-',
    },
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      render: (img, row) => <ColumnImage image={img} row={row} />,
    },
    {
      title: t('show.in'),
      dataIndex: 'show_in',
      key: 'show_in',
      render: (show_in, record) => {
        if (!show_in || !Array.isArray(show_in)) return '-';
        const text = show_in.join(', ');
        return (
          <Tooltip title={text}>
            <span style={{ maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {text}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      render: (active, row) => {
        return (
          <Switch
            key={row.id + active}
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType('active');
            }}
            checked={active}
          />
        );
      },
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => getFullDateTime(created_at),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'id',
      render: (id) => (
        <div className={tableRowClasses.options}>
          <button
            type='button'
            className={`${tableRowClasses.option} ${tableRowClasses.edit}`}
            onClick={(e) => {
              e.stopPropagation();
              goToEdit(id);
            }}
          >
            <EditOutlined />
          </button>
          <button
            type='button'
            className={`${tableRowClasses.option} ${tableRowClasses.clone}`}
            onClick={(e) => {
              e.stopPropagation();
              goToClone(id);
            }}
          >
            <CopyOutlined />
          </button>
          <button
            type='button'
            className={`${tableRowClasses.option} ${tableRowClasses.delete}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(true);
              setId([id]);
              setType('delete');
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const paramsData = {
    ...params,
    page: filters?.page || 1,
    perPage: filters?.perPage || 10,
    deleted_at: filters?.status === 'deleted_at' ? filters?.status : undefined,
  };

  const goToAddBanners = () => {
    dispatch(
      addMenu({
        id: 'banner/add',
        url: 'banner/add',
        name: t('add.banner'),
      }),
    );
    navigate('/banner/add');
  };

  const goToEdit = (id) => {
    dispatch(
      addMenu({
        url: `banner/${id}`,
        id: 'banner_edit',
        name: t('edit.banner'),
      }),
    );
    navigate(`/banner/${id}`);
  };

  const goToClone = (id) => {
    dispatch(
      addMenu({
        url: `banner/clone/${id}`,
        id: 'banner_clone',
        name: t('clone.banner'),
      }),
    );
    navigate(`/banner/clone/${id}`);
  };

  const handleDeleteRequest = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    bannerService
      .delete(params)
      .then(() => {
        dispatch(setRefetch(activeMenu));
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setId(null);
        setType(null);
      });
  };

  const handleActiveRequest = () => {
    setLoadingBtn(true);
    bannerService
      .setActive(activeId)
      .then(() => {
        dispatch(setRefetch(activeMenu));
        toast.success(t('successfully.updated'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setId(null);
        setType(null);
      });
  };

  const handleRestoreRequestAll = () => {
    setLoadingBtn(true);
    bannerService
      .restoreAll()
      .then(() => {
        dispatch(setRefetch(activeMenu));
        toast.success(t('successfully.restored'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setId(null);
        setType(null);
      });
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const handleDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.banner'));
    } else {
      setIsModalVisible(true);
    }
  };

  const handleRestore = () => {
    setIsModalVisible(true);
    setType('restore');
  };

  const handleFilter = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value, page: 1 }));
  };

  const handleUpdateFilter = (values) => {
    setFilters((prev) => ({ ...prev, ...values }));
  };

  const onChangePagination = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    handleUpdateFilter({ perPage, page });
  };

  const fetchBannersLocal = () => {
    dispatch(fetchBanners(paramsData));
    dispatch(disableRefetch(activeMenu));
  };

  useEffect(() => {
    fetchBannersLocal();
    // eslint-disable-next-line
  }, []);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      fetchBannersLocal();
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    fetchBannersLocal();
  }, [filters]);

  useEffect(() => {
    // Just set the banners as they come from the database, no sorting
    setBannersState([...banners]);
  }, [banners]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = reorder(
      bannersState,
      result.source.index,
      result.destination.index
    ).map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    setBannersState(items);
    try {
      await bannerService.updateOrder(items.map(item => item.id));
      toast.success(t('order.updated'));
      dispatch(setRefetch(activeMenu));
    } catch (e) {
      toast.error(t('order.update.failed'));
    }
  };

  const handleAutoAllocate = async () => {
    setLoadingBtn(true);
    try {
      // Sort banners: active first, then inactive
      const sortedBanners = [...banners].sort((a, b) => {
        if (a.active !== b.active) {
          return b.active - a.active;
        }
        return (a.order ?? 0) - (b.order ?? 0);
      });

      // Update order numbers: active banners get sequential numbers, inactive get 0
      const updatedBanners = sortedBanners.map((banner, index) => ({
        ...banner,
        order: banner.active ? index + 1 : 0
      }));

      // Update state
      setBannersState(updatedBanners);

      // Update database
      await bannerService.updateOrder(updatedBanners.map(item => item.id));
      toast.success(t('order.updated'));
      dispatch(setRefetch(activeMenu));
    } catch (error) {
      console.error('Error in auto allocation:', error);
      toast.error(t('order.update.failed'));
    } finally {
      setLoadingBtn(false);
    }
  };

  // Replace AntD Table with custom table for drag-and-drop
  const CustomBannerTable = ({
    data,
    loading,
    selectedRowKeys,
    onSelectRow,
    onEdit,
    onClone,
    onDelete,
    onSwitchActive,
    onDragEnd,
  }) => {
    const { t } = useTranslation();
    const allSelected = data.length > 0 && selectedRowKeys && data.every(row => selectedRowKeys.includes(row.id));
    const isRowSelected = (id) => selectedRowKeys && selectedRowKeys.includes(id);
    return (
      <>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="banners-table">
            {(provided) => (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table
                  className="custom-banner-table"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: 30, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => {
                            if (allSelected) {
                              onSelectRow([]);
                            } else {
                              onSelectRow(data.map(row => row.id));
                            }
                          }}
                        />
                      </th>
                      <th style={{ width: 30 }}></th>
                      <th style={{ width: 60 }}>{t('order')}</th>
                      <th>{t('id')}</th>
                      <th>{t('image')}</th>
                      <th>{t('show.in')}</th>
                      <th>{t('active')}</th>
                      <th>{t('created.at')}</th>
                      <th>{t('options')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center' }}>
                          <RiveResult />
                        </td>
                      </tr>
                    ) : (
                      data.map((row, index) => (
                        <Draggable
                          key={row.id}
                          draggableId={row.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? 'dragging-row' : ''}
                              style={{
                                ...provided.draggableProps.style,
                                background: isRowSelected(row.id) && !snapshot.isDragging
                                  ? '#e6f7ff'
                                  : 'white',
                                cursor: 'pointer',
                              }}
                              onClick={() => onSelectRow(row.id)}
                            >
                              <td style={{ textAlign: 'center', width: 30 }} onClick={e => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isRowSelected(row.id)}
                                  onChange={() => onSelectRow(row.id)}
                                />
                              </td>
                              <td {...provided.dragHandleProps} style={{ textAlign: 'center', cursor: 'grab', width: 30 }}>
                                <MenuOutlined style={{ color: '#999' }} />
                              </td>
                              <td style={{ textAlign: 'center', width: 60 }}>{row.active === 0 ? '-' : row.order}</td>
                              <td>{row.id}</td>
                              <td><ColumnImage image={row.img} row={row} /></td>
                              <td>
                                {row.show_in && Array.isArray(row.show_in) ? (
                                  <Tooltip title={row.show_in.join(', ')}>
                                    <span style={{ maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {row.show_in.join(', ')}
                                    </span>
                                  </Tooltip>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td>
                                <Switch
                                  checked={row.active}
                                  onChange={() => onSwitchActive(row)}
                                />
                              </td>
                              <td>{getFullDateTime(row.created_at)}</td>
                              <td>
                                <div className={tableRowClasses.options}>
                                  <button
                                    type='button'
                                    className={`${tableRowClasses.option} ${tableRowClasses.edit}`}
                                    onClick={e => { e.stopPropagation(); onEdit(row.id); }}
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    type='button'
                                    className={`${tableRowClasses.option} ${tableRowClasses.clone}`}
                                    onClick={e => { e.stopPropagation(); onClone(row.id); }}
                                  >
                                    <CopyOutlined />
                                  </button>
                                  <button
                                    type='button'
                                    className={`${tableRowClasses.option} ${tableRowClasses.delete}`}
                                    onClick={e => { e.stopPropagation(); onDelete(row.id); }}
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </tbody>
                </table>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Pagination
            current={filters.page}
            pageSize={filters.perPage}
            total={meta?.total}
            onChange={onChangePagination}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <style>{tableStyles}</style>
      <Card>
        <Space className='align-items-center justify-content-between w-100'>
          <Typography.Title
            level={1}
            style={{
              color: 'var(--text)',
              fontSize: '20px',
              fontWeight: 500,
              padding: 0,
              margin: 0,
            }}
          >
            {t('banners')}
          </Typography.Title>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={goToAddBanners}
            style={{ width: '100%' }}
          >
            {t('add.banner')}
          </Button>
        </Space>
        <Divider color='var(--divider)' />
        <Space className='w-100 justify-content-between align-items-start'>
          <Tabs
            activeKey={filters?.status}
            onChange={(key) => handleFilter('status', key)}
            type='card'
          >
            {roles.map((item) => (
              <Tabs.TabPane tab={t(item)} key={item} />
            ))}
          </Tabs>
          <Space>
            <Button 
              type="primary" 
              onClick={handleAutoAllocate}
              loading={loadingBtn}
            >
              {t('auto.allocate')}
            </Button>
            {filters?.status !== 'deleted_at' ? (
              <OutlinedButton onClick={handleDelete} color='red'>
                {t('delete.selection')}
              </OutlinedButton>
            ) : (
              <OutlinedButton onClick={handleRestore} color='green'>
                {t('restore.all')}
              </OutlinedButton>
            )}
          </Space>
        </Space>
        <CustomBannerTable
          data={bannersState}
          loading={loading}
          selectedRowKeys={id}
          onSelectRow={rowId => {
            if (Array.isArray(id)) {
              if (id.includes(rowId)) {
                setId(id.filter(i => i !== rowId));
              } else {
                setId([...id, rowId]);
              }
            } else {
              setId([rowId]);
            }
          }}
          onEdit={goToEdit}
          onClone={goToClone}
          onDelete={rowId => {
            setIsModalVisible(true);
            setId([rowId]);
            setType('delete');
          }}
          onSwitchActive={row => {
            setIsModalVisible(true);
            setActiveId(row.id);
            setType('active');
          }}
          onDragEnd={onDragEnd}
        />
        <CustomModal
          click={
            type === 'active'
              ? handleActiveRequest
              : type === 'restore'
                ? handleRestoreRequestAll
                : handleDeleteRequest
          }
          text={
            type === 'active'
              ? t('are.you.sure.you.want.to.change.the.activity?')
              : type === 'restore'
                ? t('are.you.sure.restore.all')
                : t('delete.banner')
          }
          loading={loadingBtn}
          setText={setId}
        />
      </Card>
    </>
  );
};

export default Banners;
