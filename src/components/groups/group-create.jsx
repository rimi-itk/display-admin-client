import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePostV1ScreenGroupsMutation } from "../../redux/api/api.generated";
import GroupForm from "./group-form";
import idFromUrl from "../util/helpers/id-from-url";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";

/**
 * The group edit component.
 *
 * @returns {object} The group edit page.
 */
function GroupCreate() {
  const { t } = useTranslation("common", { keyPrefix: "group-create" });
  const navigate = useNavigate();
  const headerText = t("create-new-group-header");
  const [formStateObject, setFormStateObject] = useState({
    title: "",
    description: "",
    createdBy: "@TODO:",
    modifiedBy: "@TODO:",
  });

  const [
    PostV1ScreenGroups,
    { data, error: saveError, isLoading: isSaving, isSuccess: isSaveSuccess },
  ] = usePostV1ScreenGroupsMutation();

  /**
   * When the screen is saved, the group(s) will be saved. When saved, it
   * redirects to edit screen.
   */
  useEffect(() => {
    if (isSaveSuccess && data) {
      displaySuccess(t("success-messages.saved-group"));
      navigate(`/group/edit/${idFromUrl(data["@id"])}`);
    }
  }, [isSaveSuccess]);

  /** If the group is saved with error, display the error message */
  useEffect(() => {
    if (saveError) {
      displayError(t("error-messages.save-group-error"), saveError);
    }
  }, [saveError]);

  /**
   * Set state on change in input field
   *
   * @param {object} props The props.
   * @param {object} props.target Event target.
   */
  function handleInput({ target }) {
    const localFormStateObject = { ...formStateObject };
    localFormStateObject[target.id] = target.value;
    setFormStateObject(localFormStateObject);
  }

  /** Handles submit. */
  function handleSubmit() {
    const saveData = {
      title: formStateObject.title,
      description: formStateObject.description,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
    };

    PostV1ScreenGroups({
      screenGroupScreenGroupInput: JSON.stringify(saveData),
    });
  }

  return (
    <GroupForm
      group={formStateObject}
      headerText={headerText}
      handleInput={handleInput}
      handleSubmit={handleSubmit}
      isLoading={isSaving}
      loadingMessage={t("loading-messages.saving-group")}
    />
  );
}

export default GroupCreate;
