import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Header from "../../Components/Header";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function FaqPage() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Box
        sx={{
          m: 3,
          //   width: "100%",
        }}
      >
        <Header title="FAQs" subtitle="Frequently asked Questions" />
      </Box>
      <Box
        sx={{
          margin: 2,
        }}
      >
        {data.map((item) => {
          return (
            <Accordion
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
            >
              <AccordionSummary
                aria-controls={`${item.id}d-content`}
                id={`${item.id}d-header`}
              >
                <Typography component="span">{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.content}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </>
  );
}

const data = [
  {
    id: "panel1",
    title: "What is this dashboard used for?",
    content:
      "This dashboard provides a centralized interface for managing application data, monitoring user activity, and accessing key system features. It allows administrators to view metrics, manage records, and perform routine operational tasks efficiently without requiring direct access to backend systems.",
  },
  {
    id: "panel2",
    title: "How do I add, edit, or delete records?",
    content:
      "Records can be managed through the relevant module within the dashboard. To add a new record, select the 'Add' option and complete the required fields. Existing records can be edited or deleted using the action controls provided in each row. All actions may be subject to permission restrictions based on your user role.",
  },
  {
    id: "panel3",
    title: "Are changes saved automatically?",
    content:
      "Most changes are saved automatically to ensure data integrity and prevent accidental data loss. In cases where confirmation is required, you will be prompted before the change is finalized. It is recommended to review your updates carefully before navigating away from the page.",
  },
  {
    id: "panel4",
    title: "Who has access to this system?",
    content:
      "Access to the system is controlled through role-based permissions. Different users may have varying levels of access depending on their assigned role, such as viewer, editor, or administrator. If you believe your access level is incorrect, please contact your system administrator.",
  },
  {
    id: "panel5",
    title: "How is my data secured?",
    content:
      "All data is protected using industry-standard security practices, including encrypted connections, authentication controls, and regular system monitoring. Access logs are maintained to track activity, and periodic audits are performed to ensure compliance with security policies.",
  },
  {
    id: "panel6",
    title: "What should I do if something is not working?",
    content:
      "If you encounter an issue, first try refreshing the page or logging out and back in. If the problem persists, check the Help or Support section for known issues. You may also contact the support team with details about the issue, including screenshots or error messages, to assist with troubleshooting.",
  },
];
