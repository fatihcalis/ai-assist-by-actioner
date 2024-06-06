import { Title } from "@zendeskgarden/react-notifications";
import styled from "styled-components";

export const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const AnalyzeWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const ActionsWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  gap: 4px;
`;

export const InternalNoteTitle = styled(Title)`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;
