// src/components/Admin/StaffEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateStaffMutation } from '@/services/staff/staffSliceAPI';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { Staff, StaffUpdateRequest } from '@/services/staff/types';
import dayjs from 'dayjs'
import { useGetRolesQuery, Role } from '@/services/role/roleSliceAPI';
import { useGetDepartmentsQuery, Department } from '@/services/department/departmentSliceAPI';
import { disabledFutureDate } from '@/utils/disabledFutureDate';

interface StaffEditFormProps {
    staff: Staff;
    onSuccess: () => void;
    onCancel: () => void;
}

const StaffEditForm: React.FC<StaffEditFormProps> = ({ staff, onSuccess, onCancel }) => {
    const [updateStaff, { isLoading, isError: isUpdateStaffError, error: updateStaffError }] = useUpdateStaffMutation();
    const [form] = Form.useForm();
    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useGetRolesQuery({});
    const { data: departments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useGetDepartmentsQuery({});
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            ...staff,
            dob: staff.dob ? dayjs(staff.dob) : null,
            role: staff.role?._id,
            department: staff.department?._id,
        });
    }, [form, staff]);

    const onFinish = async (values: any) => {
        try {
            const formattedDob = values['dob'] ? dayjs(values['dob']).format('YYYY-MM-DD') : "";
            const staffData: StaffUpdateRequest = {
                ...values,
                dob: formattedDob,
                role: values.role,
                department: values.department,
            };
            await updateStaff({ id: staff._id, data: staffData }).unwrap();
            messageApi.success('Staff member updated successfully');
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to update staff member: ${error?.data.message || 'Unknown error'}`;
             messageApi.error(errorMessage);
        }
    };

    if (isRolesLoading || isDepartmentsLoading) {
        return <p>Loading data...</p>;
    }

    if (isRolesError || isDepartmentsError) {
        return <p>Error fetching data.</p>;
    }

    return (
        <>
            {contextHolder}
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter address!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender!' }]}
            >
                <Select>
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[{ required: true, message: 'Please select a date of birth!' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={disabledFutureDate}
                    format="YYYY-MM-DD"
                    picker="date"
                />
            </Form.Item>
            <Form.Item
                label="Staff Role"
                name="role"
                rules={[{ required: true, message: 'Please select a staff role!' }]}
            >
                <Select
                    loading={isRolesLoading}
                    options={roles?.roles?.map((role: Role) => ({
                        label: role.name,
                        value: role._id,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select a department!' }]}
            >
                <Select
                    loading={isDepartmentsLoading}
                    options={departments?.departments?.map((department: Department) => ({
                        label: department.name,
                        value: department._id,
                    }))}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Update Staff
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default StaffEditForm;