import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ThemeForm from "./theme-form";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import { usePostV1ThemesMutation } from "../../redux/api/api.generated";

/**
 * The themes create component.
 *
 * @returns {object} The themes create page.
 */
function ThemeCreate() {
  const { t } = useTranslation("common", { keyPrefix: "theme-create" });
  const navigate = useNavigate();
  const headerText = t("create-new-theme");
  const [loadingMessage] = useState(t("loading-messages.saving-theme"));
  const [formStateObject, setFormStateObject] = useState({
    title: "",
    description: "",
    modifiedBy: "",
    createdBy: "",
    css: "",
  });

  const [
    postV1Themes,
    { data, isLoading: isSaving, error: saveError, isSuccess: isSaveSuccess },
  ] = usePostV1ThemesMutation();

  /**
   * Set state on change in input field
   *
   * @param {object} props - The props.
   * @param {object} props.target - Event target.
   */
  function handleInput({ target }) {
    const localFormStateObject = { ...formStateObject };
    localFormStateObject[target.id] = target.value;
    setFormStateObject(localFormStateObject);
  }

  /** When the theme is saved, it redirects to edit theme. */
  useEffect(() => {
    if (isSaveSuccess && data) {
      navigate("/themes/list");
    }
  }, [isSaveSuccess]);

  /** Handles submit. */
  function handleSubmit() {
    const saveData = {
      title: formStateObject.title,
      description: formStateObject.description,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
      css: formStateObject.css,
    };
    postV1Themes({ themeThemeInput: JSON.stringify(saveData) });
  }

  /** If the theme is saved, display the success message */
  useEffect(() => {
    if (isSaveSuccess) {
      displaySuccess(t("success-messages.saved-theme"));
    }
  }, [isSaveSuccess]);

  /** If the theme is saved with error, display the error message */
  useEffect(() => {
    if (saveError) {
      displayError(t("error-messages.save-theme-error"), saveError);
    }
  }, [saveError]);

  return (
    <ThemeForm
      theme={formStateObject}
      headerText={`${headerText}: ${formStateObject?.title}`}
      handleInput={handleInput}
      handleSubmit={handleSubmit}
      isLoading={isSaving}
      loadingMessage={loadingMessage}
      isSaveSuccess={isSaveSuccess}
      errors={saveError || false}
    />
  );
}

export default ThemeCreate;
