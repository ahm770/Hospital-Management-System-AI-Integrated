// src/components/MedicalRecord/ViewMedicalSummary.tsx
'use client';

import React, { useEffect } from 'react';
import { Typography, Card, Alert, Button, Spin } from 'antd';
import { useGetMedicalSummaryQuery } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { ReloadOutlined } from '@ant-design/icons';
import { Patient } from '@/services/auth/types';

interface ViewMedicalSummaryProps {
    patient: Patient;
}

const ViewMedicalSummary: React.FC<ViewMedicalSummaryProps> = ({ patient}) => {
    const { data: summaryData, isLoading, isError, error, refetch } = useGetMedicalSummaryQuery(patient._id);

    // Auto-refetch whenever the patient(patient ID) changes
    useEffect(() => {
        refetch();
    }, [patient._id, refetch]);

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <Card title="🩺 AI-Generated Medical Summary">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <Typography.Paragraph>Generating medical summary...</Typography.Paragraph>
                </div>
            </Card>
        );
    }

    if (isError) {
        return <Alert message="Error fetching medical records summary" description={(error as any)?.data?.message || "An unexpected error occurred."} type="error" showIcon />;
    }
    
    if (!summaryData || !summaryData.summary) {
        return <Alert message="No medical summary available for this patient." type="info" showIcon />;
    }

    // Convert the AI-generated summary into readable JSX
    const formattedSummary = summaryData.summary
        .split("\n\n") // Split by double line breaks to separate sections
        .map((section, index) => {
            // Check if the section is a numbered header (e.g., "1. Concise Medical Summary")
            const match = section.match(/^(\d+)\.\s(.+)$/);
            if (match) {
                return <Typography.Title key={index} level={5}>{`📌 ${match[1]}. ${match[2]}`}</Typography.Title>;
            }

            // Convert bullet points into list items
            if (section.includes("* ")) {
                const bulletPoints = section
                    .split("\n") // Split lines
                    .filter((line) => line.trim().startsWith("*")) // Only keep bullet points
                    .map((line, i) => <li key={i}>{line.replace("* ", "").trim()}</li>);

                return <ul key={index}>{bulletPoints}</ul>;
            }

            // Default case: Render as a paragraph
            return <Typography.Paragraph key={index}>{section}</Typography.Paragraph>;
        });

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title level={4}>🩺 AI-Generated Medical Summary</Typography.Title>
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh} size="small" loading={isLoading}>
                        Refresh
                    </Button>
                </div>
            }
        >
            {formattedSummary}
            
        </Card>
    );
};

export default ViewMedicalSummary;
