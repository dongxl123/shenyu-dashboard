import React, { Component, Fragment } from "react";
import { Modal, Form, Switch, Input, Select, Divider, InputNumber } from "antd";
import { connect } from "dva";
import { getIntlContent } from "../../../utils/IntlUtils";

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ global }) => ({
  platform: global.platform
}))
class AddModal extends Component {
  handleSubmit = e => {
    const { form, handleOk, id = "", data } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { name, role, enabled, config, sort } = values;
        if (data && data.length > 0) {
          config = {};
          data.forEach(item => {
            if (values[item.field]) {
              config[item.field] = values[item.field];
            }
          });
          config = JSON.stringify(config);
          if (config === "{}") {
            config = "";
          }
        }
        handleOk({ name, role, enabled, config, id, sort });
      }
    });
  };

  render() {
    let {
      handleCancel,
      form,
      config,
      name,
      enabled = true,
      role,
      id,
      data,
      sort
    } = this.props;
    let disable = id !== undefined;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 7 }
      },
      wrapperCol: {
        sm: { span: 17 }
      }
    };
    if (config) {
      config = JSON.parse(config);
    }
    return (
      <Modal
        width={520}
        centered
        title={getIntlContent("SHENYU.PLUGIN")}
        visible
        okText={getIntlContent("SHENYU.COMMON.SURE")}
        cancelText={getIntlContent("SHENYU.COMMON.CALCEL")}
        onOk={this.handleSubmit}
        onCancel={handleCancel}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem label={getIntlContent("SHENYU.PLUGIN")} {...formItemLayout}>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: getIntlContent("SHENYU.PLUGIN.SELECT")
                }
              ],
              initialValue: name
            })(
              <Input
                placeholder={getIntlContent("SHENYU.PLUGIN.PLUGIN.NAME")}
                disabled={disable}
              />
            )}
          </FormItem>
          {data &&
            data.length > 0 && (
              <Fragment>
                <Divider>
                  {name} {getIntlContent("SHENYU.COMMON.SETTING")}
                </Divider>
                {data.map((eachField, index) => {
                  let fieldInitialValue = config
                    ? config[eachField.field]
                    : undefined;
                  let fieldName = eachField.field;
                  let dataType = eachField.dataType;
                  let required = "";
                  let checkRule;
                  if (eachField.extObj) {
                    let extObj = JSON.parse(eachField.extObj);
                    required = extObj.required === "0" ? "" : extObj.required;
                    if (!fieldInitialValue) {
                      fieldInitialValue = extObj.defaultValue;
                    }
                    if (extObj.rule) {
                      checkRule = extObj.rule;
                    }
                  }
                  let rules = [];
                  if (required) {
                    rules.push({
                      required: { required },
                      message: getIntlContent("SHENYU.COMMON.PLEASEINPUT")
                    });
                  }
                  if (checkRule) {
                    rules.push({
                      // eslint-disable-next-line no-eval
                      pattern: eval(checkRule),
                      message: `${getIntlContent(
                        "SHENYU.PLUGIN.RULE.INVALID"
                      )}:(${checkRule})`
                    });
                  }
                  if (dataType === 1) {
                    return (
                      <FormItem
                        label={eachField.label}
                        {...formItemLayout}
                        key={index}
                      >
                        {getFieldDecorator(fieldName, {
                          rules,
                          initialValue: fieldInitialValue
                        })(
                          <Input placeholder={eachField.label} type="number" />
                        )}
                      </FormItem>
                    );
                  } else if (dataType === 3 && eachField.dictOptions) {
                    return (
                      <FormItem
                        label={eachField.label}
                        {...formItemLayout}
                        key={index}
                      >
                        {getFieldDecorator(fieldName, {
                          rules,
                          initialValue: fieldInitialValue
                        })(
                          <Select placeholder={eachField.label}>
                            {eachField.dictOptions.map(option => {
                              return (
                                <Option
                                  key={option.dictValue}
                                  value={option.dictValue}
                                >
                                  {option.dictName} ({eachField.label})
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    );
                  } else {
                    return (
                      <FormItem
                        label={eachField.label}
                        {...formItemLayout}
                        key={index}
                      >
                        {getFieldDecorator(fieldName, {
                          rules,
                          initialValue: fieldInitialValue
                        })(<Input placeholder={eachField.label} />)}
                      </FormItem>
                    );
                  }
                })}
                <Divider />
              </Fragment>
            )}
          <FormItem
            label={getIntlContent("SHENYU.SYSTEM.ROLE")}
            {...formItemLayout}
          >
            {getFieldDecorator("role", {
              rules: [
                {
                  required: true,
                  message: getIntlContent("SHENYU.SYSTEM.SELECTROLE")
                }
              ],
              initialValue: role
            })(<Input maxLength={20} />)}
          </FormItem>
          <FormItem
            label={getIntlContent("SHENYU.PLUGIN.SORT")}
            {...formItemLayout}
          >
            {getFieldDecorator("sort", {
              rules: [
                {
                  required: true,
                  message: getIntlContent("SHENYU.PLUGIN.INPUTSORT")
                }
              ],
              initialValue: sort
            })(
              <InputNumber
                min={0}
                max={99}
                precision={0}
                style={{ width: "100%" }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={getIntlContent("SHENYU.SYSTEM.STATUS")}
          >
            {getFieldDecorator("enabled", {
              initialValue: enabled,
              valuePropName: "checked"
            })(<Switch />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddModal);
