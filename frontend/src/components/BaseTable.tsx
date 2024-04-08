import React from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';


interface Data {
    [key: string]: any;
}

interface ColumnInitialization {
  [key: string]: boolean;
}

interface Props {
    columns: GridColDef[];
    data: Data[];
    columnInitialization?: ColumnInitialization;
    setSelectedRow: (value: any) => void;
}

const BaseTable: React.FC<Props>  = ({ columns, data, columnInitialization , setSelectedRow}) => {
    
      return (
        <Box sx={{ width: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              columns: {
                columnVisibilityModel: columnInitialization
              }
            }}
            pageSizeOptions={[10, 25]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            getRowId={(row) => row.id}
            onRowClick={(params) => setSelectedRow(params.row)}
          />
        </Box>
      );
}

export default BaseTable;
