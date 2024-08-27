import React, { useState, useEffect } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [feedbackLabel, setFeedbackLabel] = useState("");
  const [DeleteId, setDeleteId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteShowModal, setDeleteShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const removeSuccessMessage = () => {
    setSuccessMessage("");
    setDeleteShowModal(false);
  };

  const handleFeedbackLabelChange = (e) => {
    setFeedbackLabel(e.target.value);
  };

  const handleGoBack = () => {
    navigate(`/`);
  };

  const handleFeedbackForm = (feedbackLabel) => {
    navigate(`/admin/GenerateFeedbackForm/${feedbackLabel}`);
  };

  const handleViewFeedbackForm = (FormId) => {
    navigate(`/admin/ViewFeedbackForm/${FormId}`);
  };

  const filterData = async () => {
    try {
      const response = await fetch(`https://mailing.rayaninfosolutions.in/api/getFeedbackForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const filteredData = await response.json();
        setForms(filteredData);
      } else {
        console.error("Error fetching filtered data");
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  useEffect(() => {
    filterData();
  }, []);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://mailing.rayaninfosolutions.in/api/UpdateSaveType`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setDeleteShowModal(true);
        setFailureMessage("");
        setSuccessMessage(data.message);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
        filterData();
      } else {
        const data = await response.json();
        setDeleteShowModal(true);
        setSuccessMessage("");
        setFailureMessage(data.error);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading", error);
    }
    setIsSubmitting(false);
  };

  const handleEditFeedbackForm = (FormId, FormName) => {
    const feedbackLabel = FormName;
    navigate(`/admin/GenerateFeedbackForm/${feedbackLabel}/${FormId}`);
  };

  const handleConfirmation = async (FormId) => {
    setIsDeleted(true);
    setDeleteId(FormId);
  };

  const handleCancel = async () => {
    setIsDeleted(false);
    setDeleteId("");
  };

  const handleDelete = async (FormId) => {
    try {
      const response = await fetch(`https://mailing.rayaninfosolutions.in/api/DeleteForm/${FormId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setForms((prevData) =>
          prevData.filter((item) => item.FormId !== FormId)
        );
        setFailureMessage("");
        setSuccessMessage("Form Deleted successfully.");
        setDeleteShowModal(true);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
        setIsDeleted(false);
        setDeleteId("");
      } else {
        setSuccessMessage("");
        setFailureMessage("Failed To Delete Form.");
        setDeleteShowModal(true);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting Section:", error);
    }
  };

  return (
    <>
      {showModal && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title">Create Feedback Form</h5>
            </div>
            <div className="modal-body">
              <input className="form-control border-0 border-bottom" value={feedbackLabel} onChange={handleFeedbackLabelChange}/>
            </div>
            <div className="d-flex flex-row-reverse ">
              <button className="btn btn-secondary mx-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-success mx-2" onClick={() => handleFeedbackForm(feedbackLabel)} disabled={feedbackLabel === ''}>Create</button>
            </div>
          </div>
        </div>
      </div>
      {deleteShowModal && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${deleteShowModal ? "show" : ""}`} style={{ display: deleteShowModal ? "block" : "none" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title">Message</h5>
            </div>
            <div className="modal-body">
              {successMessage && (
                <span className="text-success">{successMessage}</span>
              )}
              {failureMessage && (
                <span className="text-danger">{failureMessage}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar bg-white shadow-sm p-3 mb-0 rounded sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
          <ArrowBackIcon className="me-3" style={{ fontSize: "40px" }} onClick={handleGoBack}/>
            <div style={{ position: "relative", display: "inline-block" }}>
              <ChatBubbleOutlineOutlinedIcon style={{ fontSize: "40px" }} />
              <ThumbUpIcon
                style={{
                  color: "blue",
                  position: "absolute",
                  top: "7px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "20px",
                }}
              />
            </div>
            USER FEEDBACK
          </span>
        </div>
      </nav>
      <div className="mt-5">
        <div className="row mx-1">
          <div className="col-md-3 mb-4">
            <div className="bg-white shadow-sm p-5 rounded card">
              <div
                className="d-flex flex-column justify-content-center align-items-center h-100"
                onClick={() => setShowModal(true)}
              >
                <AddOutlinedIcon style={{ color: "blue", fontSize: "75px" }} />
                <strong>New Form</strong>
              </div>
            </div>
          </div>
          {forms.map((item, index) => (
            <div className="col-md-3 mb-4" key={item.FormId}>
              <div className="bg-white shadow-sm rounded card">
                <div className="bg-warning w-100 p-3 text-center">
                  <ReceiptLongTwoToneIcon style={{ fontSize: 40 }} />
                </div>
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">{item.FormName}</h6>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Submitted</span>
                      <strong>{item.ViewSubmission}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Viewed</span>
                      <strong>{item.ViewCount}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <span>Date</span>
                      <strong>{item.SDate && item.SDate.slice(0, 10)}</strong>
                    </div>
                    <div className="text-center mb-3">
                      <button className="btn btn-primary" onClick={() => { if(item.SaveType === "Save") { handleSubmit();} else { handleViewFeedbackForm(item.FormId); } }}>{item.SaveType === "Save" ? "Publish" : "View Submission"}</button>
                    </div>
                    <div className="d-flex justify-content-around">
                      <button className="btn btn-secondary" onClick={() => handleEditFeedbackForm(item.FormId, item.FormName)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleConfirmation(item.FormId)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDeleted && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${isDeleted ? "show" : ""}`} style={{ display: isDeleted ? "block" : "none" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
            <div className="modal-header">
              <h5 className="modal-title">
                Delete <strong>Form?</strong>
              </h5>
            </div>
            <div className="modal-body">
              <p>This Will Delete Form{" "}<span className="text-danger">Permannently</span></p>
              <div className="d-flex flex-row-reverse ">
                <button className="btn btn-danger mx-2" onClick={() => handleDelete(DeleteId)}>Delete</button>
                <button className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center' style={{position: 'relative', bottom: '10px', left: '50%', transform: 'translateX(-50%)', opacity: 1, cursor: 'pointer', zIndex: '101'}}><p><strong className='text-danger'>Note: </strong>Feedback Form Will Only Show On Website When It Is Published</p></div>
    </>
  );
}

export default Dashboard;
