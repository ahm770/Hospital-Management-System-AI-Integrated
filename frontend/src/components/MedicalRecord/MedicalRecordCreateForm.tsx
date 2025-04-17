// src/components/MedicalRecord/MedicalRecordCreateForm.tsx
'use client';

import React, { useState } from 'react';
import { useCreateMedicalRecordMutation } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { Form, Input, Button, message, DatePicker, Tag } from 'antd';
import { MedicalRecordCreateRequest } from '@/services/medicalRecord/medicalRecordSliceAPI';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';

interface MedicalRecordCreateFormProps {
    onSuccess: () => void;
}

const MedicalRecordCreateForm: React.FC<MedicalRecordCreateFormProps> = ({ onSuccess }) => {
    const [createMedicalRecord, { isLoading, isError: isCreateMedicalRecordError, error: createMedicalRecordError }] = useCreateMedicalRecordMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [medicationsList, setMedicationsList] = useState<string[]>([]); // State to hold medications
    const [currentMedication, setCurrentMedication] = useState(''); // State for current medication input
    const [symptomsList, setSymptomsList] = useState<string[]>([]); // State to hold symptoms
    const [currentSymptom, setCurrentSymptom] = useState(''); // State for current symptom input


    const onFinish = async (values: any) => {
        try {
            const formattedVisitDate = values['visitDate'] ? dayjs(values['visitDate']).format('YYYY-MM-DD') : null;

            const medicalRecordData: MedicalRecordCreateRequest = {
                ...values,
                visitDate: formattedVisitDate,
                medications: medicationsList, // Send the medications list
                symptoms: symptomsList, // Send the symptoms list
            };

            await createMedicalRecord(medicalRecordData).unwrap();
            messageApi.success('Medical record created successfully');
            form.resetFields();
            setMedicationsList([]); // Clear the medications list after successful submission
            setCurrentMedication('');
            setSymptomsList([]); // Clear the symptoms list after successful submission
            setCurrentSymptom('');
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to create medical record: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    const handleMedicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMedication(e.target.value);
    };

    const handleMedicationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' && currentMedication.trim() !== '') {
            e.preventDefault(); // Prevent the comma from being entered
            setMedicationsList([...medicationsList, currentMedication.trim()]);
            setCurrentMedication('');
        }
    };

    const handleRemoveMedication = (medicationToRemove: string) => {
        setMedicationsList(medicationsList.filter(med => med !== medicationToRemove));
    };

    const handleSymptomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSymptom(e.target.value);
    };

    const handleSymptomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' && currentSymptom.trim() !== '') {
            e.preventDefault(); // Prevent the comma from being entered
            setSymptomsList([...symptomsList, currentSymptom.trim()]);
            setCurrentSymptom('');
        }
    };

    const handleRemoveSymptom = (symptomToRemove: string) => {
        setSymptomsList(symptomsList.filter(symptom => symptom !== symptomToRemove));
    };



    return (
        <>  {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Patient ID"
                    name="patient"
                    rules={[{ required: true, message: 'Please enter patient ID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Symptoms"
                    name="symptoms" // This is just a label, no actual data is bound here
                >
                    <Input
                        placeholder="Enter symptom, press comma to add"
                        value={currentSymptom}
                        onChange={handleSymptomChange}
                        onKeyDown={handleSymptomKeyDown}
                    />
                    <div style={{ marginTop: 8 }}>
                        {symptomsList.map(symptom => (
                            <Tag
                                closable
                                key={symptom}
                                onClose={(e) => {
                                    e.preventDefault();
                                    handleRemoveSymptom(symptom);
                                }}
                            >
                                {symptom}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
                <Form.Item
                    label="Diagnosis"
                    name="diagnosis"
                    rules={[{ required: true, message: 'Please enter diagnosis!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Treatment"
                    name="treatment"
                    rules={[{ required: true, message: 'Please enter treatment!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Medications"
                    name="medications" // This is just a label, no actual data is bound here
                >
                    <Input
                        placeholder="Enter medication, press comma to add"
                        value={currentMedication}
                        onChange={handleMedicationChange}
                        onKeyDown={handleMedicationKeyDown}
                    />
                    <div style={{ marginTop: 8 }}>
                        {medicationsList.map(medication => (
                            <Tag
                                closable
                                key={medication}
                                onClose={(e) => {
                                    e.preventDefault();
                                    handleRemoveMedication(medication);
                                }}
                            >
                                {medication}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
                <Form.Item
                    label="Notes"
                    name="notes"
                >
                    <Input.TextArea />
                </Form.Item>
                 <Form.Item
                    label="Visit Date"
                    name="visitDate"
                    rules={[{ required: true, message: 'Please select a visit date!' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Create Medical Record
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default MedicalRecordCreateForm;