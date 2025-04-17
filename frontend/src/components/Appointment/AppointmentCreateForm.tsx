// src/components/Appointment/AppointmentCreateForm.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCreateAppointmentMutation } from '@/services/appointment/appointmentSliceAPI';
import { Form, Input, Button, DatePicker, Select, message, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { useGetDepartmentsQuery, Department } from "@/services/department/departmentSliceAPI";
import { useGetStaffQuery  } from "@/services/staff/staffSliceAPI";
import {Staff} from "@/services/staff/types";
import logger from "@/utils/logger"

interface AppointmentCreateFormProps {
    onSuccess: () => void;
}

const AppointmentCreateForm: React.FC<AppointmentCreateFormProps> = ({ onSuccess }) => {
    const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
    const [form] = Form.useForm();
    const [autoAssignDoctor, setAutoAssignDoctor] = useState(true); // Initially checked (true)
    const [doctorOptions, setDoctorOptions] = useState<any[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const { data: departmentsData, isLoading: isDepartmentsLoading, isError: isDepartmentsError, error: departmentError } = useGetDepartmentsQuery({});
    const { data: staffData, isLoading: isStaffLoading, isError: isStaffError, error: staffError } = useGetStaffQuery({ department: selectedDepartment || "" });

    logger.silly("staff data:", staffData)
    console.log("seleced department::", selectedDepartment)

    const updateDoctorOptions = useCallback(() => {
        if (staffData?.staff) {
            const filteredDoctors = staffData.staff.filter(staff => staff.role?.name === "Doctor");
            console.log("doctors::", filteredDoctors);
            setDoctorOptions(filteredDoctors.map(doctor => ({
                key: doctor._id,
                label: `${doctor.firstName} ${doctor.lastName} - (${doctor.department.name})`,
                value: doctor._id,
            })));
        } else {
            setDoctorOptions([]);
        }
    }, [staffData]); // Only depend on staffData, which contains fetched staff

    useEffect(() => {
        updateDoctorOptions(); // Initial load and whenever staffData changes
    }, [staffData, updateDoctorOptions]);

    const onFinish = async (values: any) => {
        try {
            const formattedDate = values['date'] ? dayjs(values['date']).format('YYYY-MM-DD') : null;
            let doctorValue = null;
            if(!autoAssignDoctor) {
              doctorValue = values.doctor
            }
            const appointmentData = {
                ...values,
                date: formattedDate,
                doctor: doctorValue, // Send null if auto-assign
                department: values.department,
            };
            await createAppointment(appointmentData).unwrap();
             messageApi.success('Appointment created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to create appointment: ${error?.data.message || 'Unknown error'}`;
             messageApi.error(errorMessage);
        }
    };

    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
        form.setFieldsValue({ doctor: undefined }); // clear it from the form
    };

    const handleAutoAssignChange = (e: any) => {
        setAutoAssignDoctor(e.target.checked);
        if (e.target.checked) {
            form.setFieldsValue({ doctor: undefined });
        }
    };

    if (isDepartmentsError) {
        console.error("Error fetching departments:", departmentError);
        return <p>Error fetching departments. Please check the console.</p>;
    }

    return (
        <>
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Patient ID"
                    name="patient"
                    rules={[{ required: true, message: 'Please enter patient ID!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Department"
                    name="department"
                    rules={[{ required: true, message: 'Please select department ID!' }]}
                >
                    <Select
                        placeholder="Select Department"
                        loading={isDepartmentsLoading}
                        onChange={handleDepartmentChange}
                        options={departmentsData?.departments?.map((department: Department) => ({
                            label: department.name,
                            value: department._id,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="autoAssignDoctor"
                    valuePropName="checked"
                    initialValue={autoAssignDoctor} // Set initial value
                >
                    <Checkbox onChange={handleAutoAssignChange}>Auto Assign Doctor</Checkbox>
                </Form.Item>
                <Form.Item
                    label="Doctor"
                    name="doctor"
                    rules={[{ required: !autoAssignDoctor, message: 'Please select a doctor!' }]}
                >
                   <Select
                        placeholder="Select Doctor"
                        disabled={isStaffLoading || autoAssignDoctor}
                        loading={isStaffLoading}
                    >
                        {doctorOptions.map(option => (
                            <Select.Option key={option.key} value={option.value}>{option.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

            

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: 'Please select a date!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>

              <Form.Item
                label="Time"
                name="time"
              >
                <Input placeholder="HH:MM" />
              </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Create Appointment
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AppointmentCreateForm;