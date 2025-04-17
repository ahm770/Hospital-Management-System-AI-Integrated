// src/components/Shift/ShiftEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateShiftMutation } from '@/services/shift/shiftSliceAPI';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import { Shift } from '@/services/shift/shiftSliceAPI';
import dayjs from 'dayjs'

interface ShiftEditFormProps {
    shift: Shift;
    onSuccess: () => void;
    onCancel: () => void;
}

const ShiftEditForm: React.FC<ShiftEditFormProps> = ({ shift, onSuccess, onCancel }) => {
    const [updateShift, { isLoading }] = useUpdateShiftMutation();
    const [form] = Form.useForm();
     const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            staff: shift.staff._id,
            department: shift.department._id,
            date: dayjs(shift.date),
            startTime: shift.startTime,
            endTime: shift.endTime,
            type: shift.type,
            status: shift.status,
        });
    }, [form, shift]);

    const onFinish = async (values: any) => {
        try {
               const formattedDate = values['date'] ? dayjs(values['date']).format('YYYY-MM-DD') : null;
               const shiftData = {
                   ...values,
                   date: formattedDate,
               };
            await updateShift({ id: shift._id, data: shiftData }).unwrap();
            messageApi.success('Shift updated successfully');
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to delete shift: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
           
        }
    };

    return (
        <>  {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Staff ID"
                    name="staff"
                    rules={[{ required: true, message: 'Please enter staff ID!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Department ID"
                    name="department"
                    rules={[{ required: true, message: 'Please enter department ID!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    label="Start Time"
                    name="startTime"
                    rules={[{ required: true, message: 'Please enter start time!' }]}
                >
                    <Input placeholder="HH:MM" />
                </Form.Item>
                <Form.Item
                    label="End Time"
                    name="endTime"
                    rules={[{ required: true, message: 'Please enter end time!' }]}
                >
                    <Input placeholder="HH:MM" />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select a shift type!' }]}
                >
                    <Select>
                        <Select.Option value="morning">Morning</Select.Option>
                        <Select.Option value="evening">Evening</Select.Option>
                        <Select.Option value="night">Night</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select a status!' }]}
                >
                    <Select>
                        <Select.Option value="scheduled">Scheduled</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                        <Select.Option value="cancelled">Cancelled</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Update Shift
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ShiftEditForm;