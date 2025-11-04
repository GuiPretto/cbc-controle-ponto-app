import { Cancel, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { UsuarioPageParams } from "electron/services/UsuarioService";

import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "src/hooks/useSnackbar";
import {
  useActivateUsuario,
  useDeactivateUsuario,
  useGetUsuarioPage,
} from "src/hooks/useUsuario";
import { ptBR } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { useAuth } from "src/hooks/useAuth";

const ListarFuncionarios = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const DEFAULT_PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<GridSortModel>([]);

  const [nomeFiltro, setNomeFiltro] = useState("");
  const [nome, setNome] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [cpf, setCpf] = useState("");
  const [emailFiltro, setEmailFiltro] = useState("");
  const [email, setEmail] = useState("");
  const [ativoFiltro, setAtivoFiltro] = useState(" ");
  const [ativo, setAtivo] = useState("");

  const apiSortArray = useMemo(() => {
    if (sort.length === 0) return undefined;
    return sort.map((sortItem) => `${sortItem.field},${sortItem.sort}`);
  }, [sort]);

  const params: UsuarioPageParams = useMemo(
    () => ({
      page: page,
      size: pageSize,
      sort: apiSortArray,
      nome: nome || undefined,
      cpf: cpf || undefined,
      email: email || undefined,
      ativo: ativo ? (ativo === "true" ? true : false) : undefined,
    }),
    [page, pageSize, apiSortArray, nome, cpf, email, ativo]
  );

  const { showSnackbar } = useSnackbar();
  const { data: pageData, isFetching } = useGetUsuarioPage(params);
  const { mutate: activateMutate, isPending: isActivating } =
    useActivateUsuario();
  const { mutate: deactivateMutate, isPending: isDeactivating } =
    useDeactivateUsuario();

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

  const handleActivate = useCallback(
    (id: number) => {
      activateMutate(id, {
        onSuccess: () =>
          showSnackbar("Usuário ativado com sucesso!", "success"),
        onError: (err) =>
          showSnackbar(`Falha ao ativar: ${err.message}`, "error"),
      });
    },
    [activateMutate, showSnackbar]
  );

  const handleDeactivate = useCallback(
    (id: number) => {
      deactivateMutate(id, {
        onSuccess: () =>
          showSnackbar("Usuário inativado com sucesso!", "success"),
        onError: (err) =>
          showSnackbar(`Falha ao inativar: ${err.message}`, "error"),
      });
    },
    [deactivateMutate, showSnackbar]
  );

  const handleFilterApply = useCallback(() => {
    setNome(nomeFiltro);
    setCpf(cpfFiltro?.replace(/\D/g, ""));
    setEmail(emailFiltro);
    setAtivo(ativoFiltro.trim());
    setPage(0);
  }, [nomeFiltro, cpfFiltro, emailFiltro, ativoFiltro]);

  const formatCpf = (cpfValue: string) => {
    const numbers = String(cpfValue).replace(/\D/g, "");
    if (numbers.length !== 11) {
      return cpfValue;
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const columns: GridColDef[] = [
    { field: "nome", headerName: "Nome", width: 200 },
    { field: "cpf", headerName: "CPF", width: 300, valueFormatter: formatCpf },
    { field: "email", headerName: "E-mail", width: 300 },
    {
      field: "ativo",
      headerName: "Status",
      width: 300,
      renderCell: ({ value }) => {
        return <>{value === true ? "Ativo" : "Inativo"}</>;
      },
    },
    {
      field: "dataCriacao",
      headerName: "Data Criação",
      width: 300,
      renderCell: ({ value }) => {
        return <>{new Date(value).toLocaleDateString()}</>;
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      width: 120,
      getActions: (params) => {
        const isActive = params.row.ativo;
        const id = params.row.id;
        return [
          <GridActionsCellItem
            icon={
              isActive ? (
                <Cancel sx={{ color: red[500] }} />
              ) : (
                <CheckCircle color="success" />
              )
            }
            label={isActive ? "Inativar" : "Ativar"}
            disabled={role !== "MASTER"}
            onClick={() => {
              if (isActive) {
                handleDeactivate(id);
              } else {
                handleActivate(id);
              }
            }}
            style={{
              fontSize: "3rem",
            }}
            showInMenu
          />,
        ];
      },
    },
  ];

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Listar funcionários
      </Typography>
      <Stack direction={"row"} gap={"1rem"}>
        <TextField
          value={nomeFiltro}
          onChange={(e) => setNomeFiltro(e.target.value)}
          name="nomeFiltro"
          label="Nome"
          fullWidth
          disabled={isFetching || isActivating || isDeactivating}
        />
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <InputMask
            mask="999.999.999-99"
            value={cpfFiltro}
            onChange={(e) => setCpfFiltro(e.target.value)}
            disabled={isFetching || isActivating || isDeactivating}
            maskChar=" "
          >
            {() => <TextField label="CPF" fullWidth />}
          </InputMask>
        }
        <TextField
          value={emailFiltro}
          onChange={(e) => setEmailFiltro(e.target.value)}
          name="emailFiltro"
          label="E-mail"
          fullWidth
          disabled={isFetching || isActivating || isDeactivating}
        />
        <FormControl fullWidth>
          <InputLabel id="listar-usuarios-ativo-select">Status</InputLabel>
          <Select
            value={ativoFiltro}
            onChange={(e) => setAtivoFiltro(e.target.value)}
            name="status"
            label="Status"
            labelId="listar-usuarios-ativo-select"
            fullWidth
            disabled={isFetching || isActivating || isDeactivating}
          >
            <MenuItem value=" ">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="true">Ativo</MenuItem>
            <MenuItem value="false">Inativo</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={"row"} sx={{ mt: "1.5rem", mb: "1.5rem" }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          onClick={handleFilterApply}
          disabled={isFetching || isActivating || isDeactivating}
        >
          {isFetching ? "Filtrando..." : "Filtrar"}
        </Button>
      </Stack>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        columns={columns}
        rowSelection={false}
        rows={pageData?.content}
        onRowClick={(d) => navigate(`/listar-funcionarios/${d.id}`)}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        sortModel={sort}
        pagination
        pageSizeOptions={[pageSize]}
        rowCount={pageData?.totalElements}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={{ page: page, pageSize: pageSize }}
        loading={isFetching || isActivating || isDeactivating}
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

export default ListarFuncionarios;
