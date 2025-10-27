import { Box, Stack, Typography } from "@mui/material";
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";

import { Cancel, CheckCircle } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";

import { ptBR } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { useGetGradePage } from "src/hooks/useGrade";
import { GradePageParams } from "electron/services/GradeService";
import { red } from "@mui/material/colors";

const ListarGrades = () => {
  const navigate = useNavigate();

  const DEFAULT_PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<GridSortModel>([]);

  const apiSortArray = useMemo(() => {
    if (sort.length === 0) return undefined;
    return sort.map((sortItem) => `${sortItem.field},${sortItem.sort}`);
  }, [sort]);

  const params: GradePageParams = useMemo(
    () => ({
      page: page,
      size: pageSize,
      sort: apiSortArray,
    }),
    [page, pageSize, apiSortArray]
  );

  const { data: pageData, isFetching } = useGetGradePage(params);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      setPage(model.page);
      if (model.pageSize !== pageSize) {
        setPageSize(model.pageSize);
      }
    },
    [pageSize]
  );

  const handleSortModelChange = useCallback((newModel: GridSortModel) => {
    setSort(newModel);
  }, []);

  const columns: GridColDef[] = [
    {
      field: "horarioEntradaInicial",
      headerName: "Entrada Inicial (E1)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "bloqueioEntradaInicial",
      headerName: "Bloqueio E1 (min)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "horarioSaidaInicial",
      headerName: "Saída Inicial (S1)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "bloqueioSaidaInicial",
      headerName: "Bloqueio S1 (min)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "horarioEntradaFinal",
      headerName: "Entrada Final (E2)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "bloqueioEntradaFinal",
      headerName: "Bloqueio E2 (min)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "horarioSaidaFinal",
      headerName: "Saída Final (S2)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "bloqueioSaidaFinal",
      headerName: "Bloqueio S2 (min)",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "seg",
      headerName: "Seg",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "ter",
      headerName: "Ter",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "qua",
      headerName: "Qua",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "qui",
      headerName: "Qui",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "sex",
      headerName: "Sex",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "sab",
      headerName: "Sab",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
    {
      field: "dom",
      headerName: "Dom",
      headerAlign: "center",
      width: 100,
      renderCell: (e) => (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {!e.value ? (
            <Cancel sx={{ color: red[500] }} />
          ) : (
            <CheckCircle color="success" />
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Listar grades
      </Typography>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        columns={columns}
        rowSelection={false}
        rows={pageData?.content}
        onRowClick={(d) => navigate(`/listar-grades/${d.id}`)}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        sortModel={sort}
        pagination
        pageSizeOptions={[pageSize]}
        rowCount={pageData?.totalElements}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={{ page: page, pageSize: pageSize }}
        loading={isFetching}
        disableColumnFilter
        sx={{
          [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
            outline: "transparent",
          },
          [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
            {
              outline: "none",
            },
          [`& .${gridClasses.row}:hover`]: {
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
};

export default ListarGrades;
