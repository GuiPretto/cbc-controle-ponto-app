import { Button, Stack, Tooltip } from "@mui/material";
import {
  ColumnsPanelTrigger,
  DataGrid,
  GridColDef,
  GridViewColumnIcon,
  Toolbar,
  ToolbarButton,
  gridClasses,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";
import {
  useGenerateReportRegisterFrequencyMonthly,
  useGetByUserAndPeriodFrequencia,
} from "src/hooks/useFrequencia";
import { ptBR } from "@mui/x-data-grid/locales";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useSnackbar } from "src/hooks/useSnackbar";

const DataGridFrequencia = ({ idUsuario }: { idUsuario?: number }) => {
  const { showSnackbar } = useSnackbar();
  const [mesAnoFiltro, setMesAnoFiltro] = useState<Dayjs | null>(dayjs());
  const [mesAno, setMesAno] = useState<string | undefined>(
    mesAnoFiltro ? mesAnoFiltro.format("YYYY-MM") : undefined
  );
  const { data: registroFrequenciaMensal, isFetching } =
    useGetByUserAndPeriodFrequencia({ idUsuario, mesAno });
  const { mutate: gerarRelatoriPdf, isPending: isGerandoRelatorio } =
    useGenerateReportRegisterFrequencyMonthly();

  const handleBuscar = useCallback(() => {
    setMesAno(mesAnoFiltro ? mesAnoFiltro.format("YYYY-MM") : undefined);
  }, [mesAnoFiltro]);

  const handleGerarRelatorio = () => {
    if (isGerandoRelatorio) {
      showSnackbar("Já está sendo gerado um relatório", "error");
      return;
    }

    if (!mesAno) {
      showSnackbar("Selecione um período para gerar o relatório", "error");
      return;
    }

    if (!idUsuario) {
      showSnackbar(
        "Ocorreu um erro interno, por favor, deslogue e logue novamente",
        "error"
      );
      return;
    }

    gerarRelatoriPdf({
      idUsuario,
      mesAno,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "data",
      headerName: "Data",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (e) => <>{dayjs(e.value).format("DD/MM/YYYY")}</>,
    },
    {
      field: "entradaInicial",
      headerName: "Entrada Inicial (E1)",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    {
      field: "saidaInicial",
      headerName: "Saída Inicial (S1)",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    {
      field: "entradaFinal",
      headerName: "Entrada Final (E2)",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    {
      field: "saidaFinal",
      headerName: "Saída Final (S2)",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    { field: "justificativa", headerName: "Justificativa", width: 300 },
  ];

  const customToolbar = () => {
    return (
      <Toolbar>
        <Tooltip title="Colunas">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <GridViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>
        <Tooltip title="Gerar relatório">
          <ToolbarButton
            onClick={handleGerarRelatorio}
            disabled={isGerandoRelatorio}
          >
            <FileDownloadIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      </Toolbar>
    );
  };

  return (
    <>
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
        <Button
          variant="contained"
          loading={isFetching || isGerandoRelatorio}
          onClick={handleBuscar}
        >
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
        loading={isFetching || isGerandoRelatorio}
        disableColumnFilter
        slots={{ toolbar: customToolbar }}
        showToolbar
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
    </>
  );
};

export default DataGridFrequencia;
