// src/components/MedicalRecord/MedicalRecordView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';
  
import { formatDateWithTime } from '@/utils/dateUtils';

interface MedicalRecordViewProps {
    record: MedicalRecord;
}

const MedicalRecordView: React.FC<MedicalRecordViewProps> = ({ record }) => {
     
    return (
        <div>
            <Typography.Title level={4}>Medical Record Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Patient">
                    {record.patient.firstName} {record.patient.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Doctor">
                    {record.doctor.firstName} {record.doctor.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Diagnosis">{record.diagnosis}</Descriptions.Item>
                <Descriptions.Item label="Treatment">{record.treatment}</Descriptions.Item>
                <Descriptions.Item label="Symptoms">{record?.symptoms.join(', ')}</Descriptions.Item>
                <Descriptions.Item label="Medications">{record?.medications.join(', ')}</Descriptions.Item>
                <Descriptions.Item label="Notes">{record.notes}</Descriptions.Item>
                <Descriptions.Item label="Visit Date">{formatDateWithTime(record.visitDate)}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default MedicalRecordView;