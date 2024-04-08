import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Menu, MenuItem} from '@mui/material';
import { MenuButton } from '@mui/base/MenuButton';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

interface Data {
    [key: string]: any; // Use an index signature to support a wide range of data
}

interface Props {
    columns: Column[];
    data: Data[];
}

const AdminTable: React.FC<Props> = ({ columns, data }) => {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const handleRowCheckboxChange = (rowId: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(rowId)) {
            newSelectedRows.delete(rowId);
        } else {
            newSelectedRows.add(rowId);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allRowIds = data.map((row) => row.id);
            setSelectedRows(new Set(allRowIds));
        } else {
            setSelectedRows(new Set());
        }
    };

    const isSelected = (rowId: number) => selectedRows.has(rowId);

    const handleClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
        
    };

  return (
    <TableContainer component={Paper}>
    <Table>
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                    >
                        {column.label}
                    </TableCell>
                ))}
                <TableCell>Action</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map((row, index) => (
                <TableRow
                    key={row.id}
                    hover
                    selected={isSelected(row.id)}
                >
                    {columns.map((column) => (
                        <TableCell key={column.id}>
                            {column.id === 'status' ? row[column.id].toString() : row[column.id]}
                        </TableCell>
                    ))}
                     <TableCell>
                        {
                            // TODO: add action button with a dropdown to edit or delete row
                        }
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </TableContainer>
  );
}

export default AdminTable