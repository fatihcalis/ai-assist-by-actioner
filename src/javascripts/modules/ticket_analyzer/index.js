import { Button } from "@zendeskgarden/react-buttons";
import { Dots } from "@zendeskgarden/react-loaders";
import { Alert, Close, Title, Well } from "@zendeskgarden/react-notifications";
import { DEFAULT_THEME } from "@zendeskgarden/react-theming";
import { Paragraph, SM } from "@zendeskgarden/react-typography";
import DocumentSearchIcon from "@zendeskgarden/svg-icons/src/12/document-search-stroke.svg";
import NotesIcon from "@zendeskgarden/svg-icons/src/12/notes-stroke.svg";
import ReloadIcon from "@zendeskgarden/svg-icons/src/12/reload-stroke.svg";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { resizeContainer } from "../../../javascripts/lib/helpers";
import { useClient } from "../../providers/client";
import {
  ActionsWrapper,
  AnalyzeWrapper,
  Container,
  InternalNoteTitle,
} from "./styled";

export const TicketAnalyzer = () => {
  const { client } = useClient();
  const noteRef = useRef();
  const [ticketId, setTicketId] = useState();
  const [error, setError] = useState();
  const [latestUuid, setLatestUuid] = useState();
  const [note, setNote] = useState();

  const checkEvents = useCallback(async () => {
    try {
      const currentUserResult = await client.get("currentUser");
      const id = currentUserResult["currentUser"].id;
      const response = await client.request({
        url: `/api/v2/users/${id}/events`,
        type: "GET",
        data: "filter[source]=Actioner&filter[type]=ticket_analyze_finished",
      });

      const relatedEvent = response.events.find(
        (e) => e.properties.uuid === latestUuid
      );

      if (relatedEvent) {
        setNote(relatedEvent.properties.internal_note);
        noteRef.current.innerHTML = relatedEvent.properties.internal_note;
        setLatestUuid(undefined);
      }
    } catch (error) {
      handleError(error);
    }
  }, [client, handleError, latestUuid]);

  const appendInternalNote = useCallback(
    async ({ internalNote }) => {
      await client.set("comment.type", "internalNote");
      await client.invoke("ticket.comment.appendHtml", internalNote);

      setNote(undefined);
      noteRef.current.innerHTML = null;
    },
    [client]
  );

  const analyze = useCallback(async () => {
    if (latestUuid) {
      return;
    }

    const uuid = new Date().getTime();
    setLatestUuid(uuid);

    try {
      const currentUserResult = await client.get("currentUser");
      const email = currentUserResult["currentUser"].email;
      const options = {
        url: `https://api.actioner.com/v2/events?api_key={{setting.actionerApiToken}}`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          id: ticketId,
          email: email,
          uuid,
        }),
        secure: true,
      };

      await client.request(options);
    } catch (error) {
      handleError(error);
    }
  }, [client, handleError, latestUuid, ticketId]);

  const handleError = useCallback(
    (error) => {
      setLatestUuid(undefined);
      setError(error);
      resizeContainer(client, 1000);
    },
    [client]
  );

  const handleCloseError = useCallback(() => {
    setError(undefined);
    resizeContainer(client, 108);
  }, [client]);

  useEffect(() => {
    let handle = setInterval(() => {
      if (latestUuid) {
        checkEvents();
      }
    }, 3000);

    return () => clearInterval(handle);
  }, [checkEvents, latestUuid]);

  useEffect(() => {
    client.get("ticket.id").then((result) => {
      setTicketId(result["ticket.id"]);
    });
  }, [client]);

  useEffect(() => {
    if (note) {
      resizeContainer(client, 1000);
    } else {
      resizeContainer(client, 200);
    }
  }, [client, note]);

  return (
    <Container>
      {error && (
        <Alert type="error" style={{ width: "100%" }}>
          <Title>Error</Title>
          {JSON.stringify(error)}
          <Close aria-label="Close" onClick={handleCloseError} />
        </Alert>
      )}
      {!note && (
        <AnalyzeWrapper>
          <Paragraph>
            <SM tag="span">
              Click to analyze and generate automated ticket summaries, detect
              intent, and track sentiment, providing quick insights to enhance
              customer support.
            </SM>
          </Paragraph>
          <Button
            size="small"
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={analyze}
          >
            <>
              <Button.StartIcon>
                <DocumentSearchIcon />
              </Button.StartIcon>
              {latestUuid ? (
                <Dots
                  delayMS={0}
                  aria-label="Analyze"
                  size={DEFAULT_THEME.space.base * 5}
                />
              ) : (
                "Analyze"
              )}
            </>
          </Button>
        </AnalyzeWrapper>
      )}
      {note && (
        <>
          <Well style={{ width: "100%" }}>
            <InternalNoteTitle isRegular>
              <NotesIcon />
              Internal note
            </InternalNoteTitle>
            <Paragraph>
              <SM tag="span" ref={noteRef}>
                {note}
              </SM>
            </Paragraph>
          </Well>

          <ActionsWrapper>
            <Button
              size="small"
              isBasic
              onClick={() => {
                setNote(undefined);
                noteRef.current.innerHTML = null;
              }}
            >
              Cancel
            </Button>
            <Button size="small" onClick={analyze}>
              <Button.StartIcon>
                <ReloadIcon />
              </Button.StartIcon>
              {latestUuid ? (
                <Dots
                  delayMS={0}
                  aria-label="Regenerate"
                  size={DEFAULT_THEME.space.base * 5}
                />
              ) : (
                "Regenerate"
              )}
            </Button>
            <Button
              size="small"
              onClick={() => {
                appendInternalNote({ internalNote: note });
              }}
              isPrimary
            >
              <Button.StartIcon>
                <NotesIcon />
              </Button.StartIcon>
              Append
            </Button>
          </ActionsWrapper>
        </>
      )}
    </Container>
  );
};
