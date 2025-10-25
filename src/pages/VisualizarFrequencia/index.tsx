import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { useGetByUserAndPeriodFrequencia } from "src/hooks/useFrequencia";
import { ptBR } from "@mui/x-data-grid/locales";

const VisualizarFrequencia = () => {
  const [mesAnoFiltro, setMesAnoFiltro] = useState<Dayjs | null>(dayjs());
  const [mesAno, setMesAno] = useState<string | undefined>(
    mesAnoFiltro ? mesAnoFiltro.format("YYYY-MM") : undefined
  );
  const { idUsuario } = useAuth();
  const { data: registroFrequenciaMensal, isFetching } =
    useGetByUserAndPeriodFrequencia({ idUsuario, mesAno });

  const handleBuscar = useCallback(() => {
    setMesAno(mesAnoFiltro ? mesAnoFiltro.format("YYYY-MM") : undefined);
  }, [mesAnoFiltro]);

  const columns: GridColDef[] = [
    {
      field: "data",
      headerName: "Data",
      width: 200,
      renderCell: (e) => <>{dayjs(e.value).format("DD/MM/YYYY")}</>,
    },
    {
      field: "entradaInicial",
      headerName: "Entrada Inicial (E1)",
      width: 300,
      // renderCell: (e) => (
      //   <>{e.value === "-" ? e.value : dayjs(e.value).format("HH:mm")}</>
      // ),
    },
    {
      field: "saidaInicial",
      headerName: "Saída Inicial (S1)",
      width: 300,
      // renderCell: (e) => (
      //   <>{e.value === "-" ? e.value : dayjs(e.value).format("HH:mm")}</>
      // ),
    },
    {
      field: "entradaFinal",
      headerName: "Entrada Final (E2)",
      width: 300,
      // renderCell: (e) => (
      //   <>{e.value === "-" ? e.value : dayjs(e.value).format("HH:mm")}</>
      // ),
    },
    {
      field: "saidaFinal",
      headerName: "Saída Final (S2)",
      width: 300,
      // renderCell: (e) => (
      //   <>{e.value === "-" ? e.value : dayjs(e.value).format("HH:mm")}</>
      // ),
    },
    { field: "justificativa", headerName: "Justificativa", width: 300 },
  ];

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Visualizar frequência
      </Typography>
      <Stack
        direction={"row"}
        gap={"1.5rem"}
        alignItems={"end"}
        sx={{ mb: "1.5rem" }}
      >
        <DatePicker
          value={mesAnoFiltro}
          onChange={(e) => setMesAnoFiltro(e)}
          name="mesAnoFiltro"
          label={"Período"}
          views={["month", "year"]}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleBuscar}>
          Buscar
        </Button>
      </Stack>
      <DataGrid
        density="compact"
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        columns={columns}
        rowSelection={false}
        rows={registroFrequenciaMensal?.frequencias.map((f) => ({
          ...f,
          id: f.data,
        }))}
        pagination
        hideFooter
        loading={isFetching}
        disableColumnFilter
        sx={{
          maxHeight: "60vh",
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

export default VisualizarFrequencia;
