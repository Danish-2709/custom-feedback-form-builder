import React, { useState, useEffect } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewFeedbackForm() {
    const { FormId } = useParams();
    const [UUId, setUUId] = useState(null);
    const [details, setDetails] = useState({});
    const [detailsChild, setDetailsChild] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(`/admin/Dashboard`);
    };

    useEffect(() => {
        fetch(`https://mailing.rayaninfosolutions.in/api/viewFeedbackForm/${FormId}`)
            .then((response) => response.json())
            .then((formDataArray) => {
                const formData = formDataArray[0];
                setDetails(formData);
                setUUId(formData.UUId);
            })
            .catch((error) => console.error('Error fetching form details:', error));
        fetch(`https://mailing.rayaninfosolutions.in/api/viewFeedbackForm/${FormId}`)
            .then((response) => response.json())
            .then((dataArray) => {
                setDetailsChild(dataArray);
            })
            .catch((error) => console.error('Error fetching children data:', error));
    }, [FormId]);

    useEffect(() => {
        if (UUId) {
            fetch(`https://mailing.rayaninfosolutions.in/api/viewFeedbackFormMoreDetails/${UUId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setFeedbackData(data);
                })
                .catch((error) => {
                    console.error('Error fetching feedback data:', error);
                });
        }
    }, [UUId]); 

    return (
        <>
            <nav className="navbar bg-white shadow-sm p-3 mb-0 rounded sticky-top">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">
                        <ArrowBackIcon className="me-3" style={{ fontSize: "40px" }} onClick={handleGoBack} />
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
            <div className='row mx-1'>
                <div className='col-12 mt-3'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='bg-white shadow-sm mb-5 rounded card w-100'>
                            <div className='bg-primary text-white w-100 p-3 rounded'>
                                <span className='d-flex justify-content-between'>
                                    <strong>{details.FormName}</strong>
                                    <strong>{details.SDate && details.SDate.slice(0, 10)}</strong>
                                </span>
                            </div>
                            <div className="container text-center">
                                <div className="row justify-content-center">
                                    <div className="col-4">
                                        <strong className="display-4 fw-bold">{details.ViewCount}</strong>
                                        <div>Views</div>
                                    </div>
                                    <div className="col-4">
                                        <strong className="display-4 fw-bold">{details.ViewSubmission}</strong>
                                        <div>Submitted</div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column mx-5 mb-4">
                                <strong style={{ fontSize: '13px' }}>Page URL Contains {details.URLCondition || 'NA'}</strong>
                                <strong style={{ fontSize: '13px' }}>Date: {(details.Date && details.Date.slice(0, 10)) || 'NA'}</strong>
                                <strong style={{ fontSize: '13px' }}>Time: {(details.Time && details.Time.slice(11, 16)) || 'NA'}</strong>
                            </div>
                            <h4 className="mx-5 mb-3">Feedback List</h4>
                            <div className="accordion mx-5 mb-3" id="accordionExample">
                                {detailsChild.map((item, index) => (
                                    <div className="accordion-item" key={index}>
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${index}`}
                                                aria-expanded="true"
                                                aria-controls={`collapse${index}`}
                                                onClick={() => setUUId(item.UUId)}  // Set UUId on click
                                            >
                                                Feedback {index + 1}
                                            </button>
                                        </h2>
                                        <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                {feedbackData.map((feedbackItem, idx) => (
                                                    <div key={idx}>
                                                        {feedbackItem.FieldType === 'Textarea' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.TextArea}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Numeric rating' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.Numeric}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Star rating' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.Star}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Smiley rating' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.Smiley}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Single line input' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.Input}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Radio button' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.ROptions}</p>
                                                            </>
                                                        )}
                                                        {feedbackItem.FieldType === 'Categories' && (
                                                            <>
                                                                <strong className="fontSize">{feedbackItem.Label}</strong>
                                                                <p>{feedbackItem.COptions}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
