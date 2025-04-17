// src/components/Admin/StaffCreateForm.tsx
'use client';

import React from 'react';
import { useCreateStaffMutation } from '@/services/staff/staffSliceAPI';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { StaffCreateRequest } from '@/services/staff/types';
import dayjs from 'dayjs'
import { useGetRolesQuery, Role } from '@/services/role/roleSliceAPI'; // Import hook for fetching roles
import { useGetDepartmentsQuery, Department } from '@/services/department/departmentSliceAPI'; // Import hook for fetching departments

interface StaffCreateFormProps {
    onSuccess: () => void;
}

const StaffCreateForm: React.FC<StaffCreateFormProps> = ({ onSuccess }) => {
    const [createStaff, { isLoading, isError: isCreateStaffError, error: createStaffError }] = useCreateStaffMutation();
    const [form] = Form.useForm();
    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useGetRolesQuery({});
    const { data: departments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useGetDepartmentsQuery({});
    const [messageApi, contextHolder] = message.useMessage();
 console.log("roles::",roles)
 console.log("departments::",departments)
    const onFinish = async (values: StaffCreateRequest) => {
        try {
            // Format the date of birth using moment.js
            const formattedDob = values['dob'] ? dayjs(values['dob']).format('YYYY-MM-DD') : "";
            // Find the selected role and department names
            const selectedRole = roles?.roles?.find(role => role._id === values.role);
            const selectedDepartment = departments?.departments?.find(department => department._id === values.department);
            if(!selectedRole || !selectedDepartment){
                return
            }
            const staffData = {
                ...values,
                dob: formattedDob,
                role: selectedRole.name, // Send the role name
                department: selectedDepartment.name, // Send the department name
            };

            await createStaff(staffData).unwrap();
            messageApi.success('Staff member created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to create staff member: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    const disabledFutureDate = (current: dayjs.Dayjs ) => {
           // Disable dates after today
           return current && current > dayjs().endOf('day');
       };

     const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

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
                     <Select
                        placeholder="Select Gender"
                        options={genderOptions}
                    />
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
                        options={departments?.departments.map((department: Department) => ({
                            label: department.name,
                            value: department._id,
                        }))}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Create Staff
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default StaffCreateForm;