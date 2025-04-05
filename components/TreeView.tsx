import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';
interface TimeLog {
    id: string;
    employeeId: string;
    employee: string;
    task: string;
    startTime: string;
    endTime: string;
    hours: number;
    status: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

interface EmployeeNodeProps {
    employeeId: string;
    employee: string;
    items: TimeLog[];
}

interface DateNodeProps {
    date: string;
    items: TimeLog[];
}

interface GroupedByEmployee {
    [key: string]: {
        employee: string;
        items: TimeLog[];
    };
}

interface GroupedByDate {
    [key: string]: TimeLog[];
}

export function TreeViewComponent({ data }: { data: TimeLog[] }): React.ReactElement {
    // Group data by employeeId
    const groupedByEmployee = data.reduce((acc: GroupedByEmployee, item: TimeLog) => {
        if (!acc[item.employeeId]) {
            acc[item.employeeId] = {
                employee: item.employee,
                items: []
            };
        }
        acc[item.employeeId].items.push(item);
        return acc;
    }, {});

    return (
        <div className="tree-view">
            {Object.entries(groupedByEmployee).map(([employeeId, group]) => (
                <EmployeeNode
                    key={employeeId}
                    employeeId={employeeId}
                    employee={group.employee}
                    items={group.items}
                />
            ))}
        </div>
    );
};

const EmployeeNode = ({ employeeId, employee, items }: EmployeeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter()
    // Group items by startDate
    const groupedByDate = items.reduce((acc: GroupedByDate, item: TimeLog) => {
        const date = new Date(item.startTime).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const totalMinutes = items.reduce((acc, item) => acc + (item.hours), 0);

    return (
        <div className="employee-node ">
            <div
                className="node-header h-10 p-2 bg-primary text-white rounded-md mb-2"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer', marginBottom: '8px' }}
            >
                <span style={{ marginRight: '8px' }}>
                    {isExpanded ? '▼' : '▶'}
                </span>
                <span>
                    {employee} (total hours: {formatDuration(totalMinutes)})
                </span>
                <span>
                    <span className='hidden text-sm text-blue-500 cursor-pointer' onClick={() => router.push(`/manager/users/${employeeId}`)}>View</span>
                </span>
            </div>

            {isExpanded && (
                <div style={{ marginLeft: '20px' }}>
                    {Object.entries(groupedByDate).map(([date, dateItems]) => (
                        <DateNode key={date} date={date} items={dateItems} />
                    ))}
                </div>
            )}
        </div>
    );
};
const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

const DateNode = ({ date, items }: DateNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const totalMinutes = items.reduce((acc, item) => acc + (item.hours), 0);

    return (
        <div className="date-node">
            <div
                className="date-header h-10 p-2 bg-secondary text-white rounded-md mb-2"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer', marginBottom: '4px' }}
            >
                <span style={{ marginRight: '8px' }}>
                    {isExpanded ? '▼' : '▶'}
                </span>
                <span>
                    Date: {date} ({items.length} tasks - {formatDuration(totalMinutes)} hours)
                </span>
            </div>

            {isExpanded && (
                <div style={{ marginLeft: '20px' }}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="tree-item p-2 "
                        >
                            <Badge color="primary" className='text-sm h-8'> From &nbsp;
                                {new Date(item.startTime).toLocaleString()} to &nbsp;
                                {new Date(item.endTime).toLocaleString()} on &nbsp;
                                {item.task}, Spent {formatDuration(item.hours)} and current status is {item.status.split('_').join(' ')}</Badge>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};