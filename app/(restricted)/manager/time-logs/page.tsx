'use client'

import { TreeViewComponent } from '@/components/TreeView'
import { TimeLog } from '@prisma/client'
import { useState, useEffect } from 'react'

export default function Page() {
    const [timeLogs, setTimeLogs] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await fetch('/api/time-logs')
            const logs = await data.json()
            const modifiedLogs = logs.map((log: TimeLog) => {
                return {
                    id: log.id,
                    // @ts-expect-error employee is not included in the response
                    employee: log.employee.user.name,
                    employeeId: log.employeeId,
                    // @ts-expect-error task is not included in the response
                    task: log.task.title,
                    taskId: log.taskId,
                    // @ts-expect-error status is not included in the response
                    status: log.task.status,
                    hours: log.duration,
                    startTime: log.startTime,
                    endTime: log.endTime,
                    notes: log.notes,
                    createdAt: log.createdAt,
                    updatedAt: log.updatedAt,
                }
            })
            setTimeLogs(modifiedLogs)
            console.log(modifiedLogs)
        }
        fetchData()
    }, [])


    return (
        <div className='p-6'>
            <p className='text-2xl font-bold'>Time Logs</p>
            <div className='grid grid-cols-1  gap-4'>
                <TreeViewComponent data={timeLogs} />
            </div>
        </div>
    );
}