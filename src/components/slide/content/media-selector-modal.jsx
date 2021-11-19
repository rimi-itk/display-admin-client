import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import ModalDialog from "../../util/modal/modal-dialog";
import SlideMediaList from "./media-selector-list";

/**
 * Slide media modal component.
 *
 * @param {object} props Props.
 * @param {boolean} props.show Whether to show the modal.
 * @param {Function} props.onClose Callback on close modal.
 * @param {Function} props.selectMedia Callback for selecting media.
 * @param {boolean} props.multiple Whether it should be possible to choose multiple media.
 * @param {Array} props.selectedMedia Selected media.
 * @param {string} props.fieldName The target field name.
 * @returns {object} The modal.
 */
function MediaSelectorModal({
  show,
  onClose,
  selectMedia,
  selectedMedia,
  multiple,
  fieldName,
}) {
  const { t } = useTranslation("common");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (selectedMedia) {
      const newSelected = selectedMedia.map((entry) => entry["@id"]);
      setSelected(newSelected);
    }
  }, [selectedMedia]);

  const handleAccept = () => {
    selectMedia({ target: { id: fieldName, value: selected } });
    onClose();
  };

  const handleClick = (data) => {
    if (!multiple) {
      selectMedia({ target: { id: fieldName, value: [data] } });
      onClose();
    } else {
      const newSelected = [];
      let found = false;

      [...selected].forEach((element) => {
        if (
          element === data["@id"] ||
          (Object.prototype.hasOwnProperty.call(element, "@id") &&
            element["@id"] === data["@id"])
        ) {
          found = true;
        } else {
          newSelected.push(element);
        }
      });

      if (!found) {
        newSelected.push(data);
      }

      setSelected(newSelected);
    }
  };

  const handleReject = () => {
    onClose();
  };

  const getSelectedIds = () => {
    return selected.map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }

      return entry["@id"];
    });
  };

  if (!show) {
    return <></>;
  }

  return (
    <Modal show={show} size="xl" id="slide-media-modal" onHide={onClose}>
      <ModalDialog
        title={
          multiple
            ? t("slide-media-modal.multiple-select-title")
            : t("slide-media-modal.single-select-title")
        }
        onClose={handleReject}
        handleAccept={handleAccept}
        acceptText={t("slide-media-modal.accept")}
        declineText={t("slide-media-modal.cancel")}
      >
        <SlideMediaList
          onItemClick={handleClick}
          selectedMediaIds={getSelectedIds()}
          multiple={multiple}
        />
      </ModalDialog>
    </Modal>
  );
}

MediaSelectorModal.propTypes = {
  multiple: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMedia: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ).isRequired,
  selectMedia: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default MediaSelectorModal;
