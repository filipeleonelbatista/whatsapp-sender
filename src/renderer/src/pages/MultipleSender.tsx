import DrawerComponent from "../components/DrawerComponent";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `event-tab-${index}`,
    "aria-controls": `event-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function MultipleSender() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [tasksTabs, setTasksTabs] = useState<any[]>([]);
  return (
    <DrawerComponent title="Envio simultâneo (B23eta)">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Envio 1" {...a11yProps(0)} />
          </Tabs>

          <Button onClick={() => console.log("Olá")}>
            <FaPlus size={12} />
          </Button>
        </Box>
        <CustomTabPanel value={value} index={0}></CustomTabPanel>
      </Box>
    </DrawerComponent>
  );
}
