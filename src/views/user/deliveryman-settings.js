import { Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import MediaUpload from '../../components/upload';
import Map from '../../components/map';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DelivertSetting = ({ location, setLocation, form, image, setImage }) => {
  const { t } = useTranslation();
  const selectedTypeOfTechnique = Form.useWatch('type_of_technique', form);
  return (
    <Row gutter={12}>
      <Col span={12}>
        <Form.Item
          label={t('type.of.technique')}
          name='type_of_technique'
          className='w-100'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <Select className='w-100' options={type_of_technique} />
        </Form.Item>
      </Col>

      {selectedTypeOfTechnique !== 'foot' && (
        <>
          <Col span={12}>
            <Form.Item
              label={t('brand')}
              name='brand'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(
                        new Error(t('must.be.at.least.2 ')),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('model')}
              name='model'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(
                        new Error(t('must.be.at.least.2 ')),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('car.number')}
              name='number'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(
                        new Error(t('must.be.at.least.2 ')),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('car.color')}
              name='color'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(
                        new Error(t('must.be.at.least.2 ')),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('image')}
              name='images'
              rules={[
                {
                  validator(_, value) {
                    if (image.length === 0) {
                      return Promise.reject(new Error(t('required')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MediaUpload
                type='deliveryman/settings'
                imageList={image}
                setImageList={setImage}
                form={form}
                length='1'
                multiple={true}
              />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={24}>
        <Form.Item label={t('map')} name='location' className='w-100'>
          <Map location={location} setLocation={setLocation} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DelivertSetting;
