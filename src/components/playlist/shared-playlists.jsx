import { React, useState, useEffect, useContext } from "react";
import { Button, Col } from "react-bootstrap";
import { faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import UserContext from "../../context/user-context";
import ContentHeader from "../util/content-header/content-header";
import List from "../util/list/list";
import ContentBody from "../util/content-body/content-body";
import PlaylistCalendarCell from "../screen-list/playlist-calendar-cell";
import { displayError } from "../util/list/toast-component/display-toast";
import getSharedPlaylistColumns from "./shared-playlists-column";
import { useGetV1PlaylistsQuery } from "../../redux/api/api.generated";

/**
 * The list component for shared playlists.
 *
 * @returns {object} The playlist containing shared playlists.
 */
function SharedPlaylists() {
  const { t } = useTranslation("common", { keyPrefix: "shared-playlists" });

  // Context
  const context = useContext(UserContext);

  // Local state
  const [view, setView] = useState("list");
  const [page, setPage] = useState();
  const [isPublished, setIsPublished] = useState();
  const [searchText, setSearchText] = useState();
  const [listData, setListData] = useState();

  // Get method
  const {
    data,
    error: playlistsGetError,
    isLoading,
    refetch,
  } = useGetV1PlaylistsQuery({
    page,
    order: { createdAt: "desc" },
    title: searchText,
    published: isPublished,
    isCampaign: false,
    sharedWithMe: true,
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  /**
   * Sets next page.
   *
   * @param {number} pageNumber - The next page.
   */
  function onChangePage(pageNumber) {
    setPage(pageNumber);
  }

  /**
   * Sets is published
   *
   * @param {number} localIsPublished - Whether the playlist is published.
   */
  function onIsPublished(localIsPublished) {
    if (localIsPublished === "all") {
      setIsPublished(undefined);
    } else {
      setIsPublished(localIsPublished === "published");
    }
  }

  /**
   * Handles search.
   *
   * @param {object} localSearchText - The search text.
   */
  function onSearch(localSearchText) {
    setSearchText(localSearchText);
  }

  // The columns for the table.
  const columns = getSharedPlaylistColumns();

  // Error with retrieving list of playlists
  useEffect(() => {
    if (playlistsGetError) {
      displayError(t("error-messages.load-error"), playlistsGetError);
    }
  }, [playlistsGetError]);

  return (
    <>
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new")}
        newBtnLink="/playlist/create?shared=true"
      >
        <Col md="auto">
          {view === "list" && (
            <Button
              style={{ width: "110px" }}
              onClick={() => setView("calendar")}
            >
              <FontAwesomeIcon className="me-1" icon={faCalendar} />
              {t("change-view-calendar")}
            </Button>
          )}
          {view === "calendar" && (
            <Button style={{ width: "110px" }} onClick={() => setView("list")}>
              <FontAwesomeIcon className="me-1" icon={faList} />
              {t("change-view-list")}
            </Button>
          )}
        </Col>
      </ContentHeader>
      {listData && (
        <ContentBody>
          <List
            displayPublished
            columns={columns}
            handlePageChange={onChangePage}
            totalItems={listData["hydra:totalItems"]}
            handleSearch={onSearch}
            data={listData["hydra:member"]}
            calendarView={view === "calendar"}
            handleIsPublished={onIsPublished}
            isLoading={isLoading}
            loadingMessage={t("loading")}
          >
            {view === "calendar" && <PlaylistCalendarCell />}
          </List>
        </ContentBody>
      )}
    </>
  );
}

export default SharedPlaylists;
