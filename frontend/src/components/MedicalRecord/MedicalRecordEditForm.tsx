// src/components/MedicalRecord/MedicalRecordEditForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUpdateMedicalRecordMutation } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { Form, Input, Button, message, DatePicker, Tag } from 'antd';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';
import dayjs from 'dayjs';

interface MedicalRecordEditFormProps {
    record: MedicalRecord;
    onSuccess: () => void;
    onCancel: () => void;
}

const MedicalRecordEditForm: React.FC<MedicalRecordEditFormProps> = ({ record, onSuccess, onCancel }) => {
    const [updateMedicalRecord, { isLoading, isError: isUpdateMedicalRecordError, error: updateMedicalRecordError }] = useUpdateMedicalRecordMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [medicationsList, setMedicationsList] = useState<string[]>([]);
    const [currentMedication, setCurrentMedication] = useState('');
    const [symptomsList, setSymptomsList] = useState<string[]>([]);
    const [currentSymptom, setCurrentSymptom] = useState('');


    useEffect(() => {
        // Initialize the medicationsList from the record
        setMedicationsList(record.medications || []); // Use an empty array as default
        setSymptomsList(record.symptoms || []);
    }, [record.medications, record.symptoms]);

    useEffect(() => {
        // Set form values initially, excluding medications and symptoms (handled separately)
        form.setFieldsValue({
            patient: record.patient._id,
            doctor: record.doctor._id,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            notes: record.notes,
            visitDate: dayjs(record.visitDate),
        });
    }, [form, record]);

    const onFinish = async (values: any) => {
        try {
            const formattedVisitDate = values['visitDate'] ? dayjs(values['visitDate']).format('YYYY-MM-DD') : null;

            const medicalRecordData = {
                ...values,
                visitDate: formattedVisitDate,
                medications: medicationsList, // Send the updated medications list
                symptoms: symptomsList,
            };

            await updateMedicalRecord({ id: record._id, data: medicalRecordData }).unwrap();
            messageApi.success('Medical record updated successfully');
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to update medical record: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    const handleMedicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMedication(e.target.value);
    };

    const handleMedicationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' && currentMedication.trim() !== '') {
            e.preventDefault();
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
            e.preventDefault();
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
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Doctor ID"
                    name="doctor"
                    rules={[{ required: true, message: 'Please enter doctor ID!' }]}
                >
                    <Input disabled />
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
                        Update Medical Record
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default MedicalRecordEditForm;