import { Tooltip } from "@mui/material";
import { ColumnsPanelTrigger, Toolbar, ToolbarButton } from "@mui/x-data-grid";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const CustomToolbar = ({
  exportFunction,
}: {
  exportFunction: () => unknown;
}) => {
  return (
    <Toolbar>
      <Tooltip title="Colunas">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Gerar relatório">
        <ToolbarButton onClick={() => exportFunction?.()}>
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
};

export default CustomToolbar;
