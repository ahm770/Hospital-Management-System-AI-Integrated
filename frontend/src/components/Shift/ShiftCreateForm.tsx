// src/components/Shift/ShiftCreateForm.tsx
'use client';

import React, { useState } from 'react';
import { useCreateShiftMutation } from '@/services/shift/shiftSliceAPI';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs'
import { useGetStaffQuery } from "@/services/staff/staffSliceAPI"
import { useGetDepartmentsQuery } from "@/services/department/departmentSliceAPI"

interface ShiftCreateFormProps {
    onSuccess: () => void;
}

const ShiftCreateForm: React.FC<ShiftCreateFormProps> = ({ onSuccess }) => {
    const [createShift, { isLoading }] = useCreateShiftMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
     const { data: staffData } = useGetStaffQuery({})
    const { data: departmentsData } = useGetDepartmentsQuery({})

    const onFinish = async (values: any) => {
        try {
            const formattedDate = values['date'] ? dayjs(values['date']).format('YYYY-MM-DD') : null;

            const shiftData = {
                ...values,
                date: formattedDate,
            };
            await createShift(shiftData).unwrap();
           messageApi.success('Shift created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to delete shift: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
            
        }
    };

    return (
        <>   {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Staff ID"
                    name="staff"
                    rules={[{ required: true, message: 'Please enter staff ID!' }]}
                >
                    <Select
                        options={staffData?.staff.map(staff => ({label: staff.firstName, value: staff._id}))}
                    />
                </Form.Item>
                <Form.Item
                    label="Department ID"
                    name="department"
                    rules={[{ required: true, message: 'Please enter department ID!' }]}
                >
                  <Select
                    options={departmentsData?.departments.map(department => ({ label: department.name, value: department._id }))}
                  />
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Create Shift
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ShiftCreateForm;