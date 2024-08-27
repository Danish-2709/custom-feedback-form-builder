import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [FormId, setFormId] = useState('');
  const [formName, setformName] = useState([]);
  const [feedbackFields, setFeedbackFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e, fieldId) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  const handleFieldChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumericRatingClick = (index, fieldId) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: index + 1
    }));
  };

  const handleStarRatingClick = (index, fieldId) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: index + 1
    }));
  };

  const handleSmileyRatingClick = (index, fieldId) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: index + 1
    }));
  };

  const getSmileyColor = (index) => {
      const colors = ['#FF0000', '#FF4500', '#FFD700', '#ADFF2F', '#008000'];
      return colors[index];
  };

  const handleAdminForm = () => {
    navigate(`/admin/Dashboard`)
  }

  useEffect(() => {
    const filterData = async () => {
      try {
        const response = await fetch(`https://mailing.rayaninfosolutions.in/api/getFeedbackToShowOnWebsite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
  
        if (response.ok) {
          const filteredData = await response.json();
          console.log(filteredData);
          const currentDate = new Date();
  
          filteredData.forEach(async (form) => {
            const formDate = form.Date ? new Date(form.Date) : null;
            const formTime = form.Time ? new Date(form.Time) : null;
            const formURLCondition = form.URLCondition;
            const formId = form.FormId;
  
            const isDateValid =
              formDate === null ||
              currentDate.toISOString().split("T")[0] === formDate.toISOString().split("T")[0];
            const isTimeValid =
              formTime === null ||
              (currentDate.getHours() === formTime.getUTCHours() &&
                currentDate.getMinutes() === formTime.getUTCMinutes());
            const isURLValid = window.location.href.includes(formURLCondition);
            const hasViewed = localStorage.getItem(`viewed_${formId}`);
  
            const isFeedbackSubmitted = localStorage.getItem(`feedbackSubmitted_${formId}`);
  
            if (isDateValid && isTimeValid && isURLValid && !isFeedbackSubmitted) {
              localStorage.setItem(`viewed_${formId}`, "true");
              setFormId(form.FormId || "");
              setformName(form.FormName || "");
              const mappedFields = filteredData
                .filter((field) => field.FormId === formId) 
                .map((field) => ({
                  type: field.FieldType,
                  headingLabel: field.Label,
                  isRequired: field.Validation === "1",
                  errorMessage: field.Error,
                  options: JSON.parse(field.Options),
                  FormChildId: field.FormChildId,
                }));
              setFeedbackFields(mappedFields);
              setShowModal(true);
  
              if (isDateValid && isTimeValid && isURLValid && !hasViewed) {
                await fetch("https://mailing.rayaninfosolutions.in/api/incrementFeedbackViewCount", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ formId: form.FormId }),
                });
              }
            }
          });
        } else {
          console.error("Error fetching filtered data");
        }
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };
  
    const isFeedbackSubmitted = localStorage.getItem(`feedbackSubmitted_${FormId}`);
    if (!isFeedbackSubmitted) {
      filterData();
    }
  }, [FormId]); 
  
  const generatedNumbers = new Set(); 

  const generateThreeDigitNumber = () => {
    let number;
    do {
      number = Math.floor(Math.random() * 1000); 
    } while (generatedNumbers.has(number));
  
    generatedNumbers.add(number); 
    return number.toString().padStart(3, '0'); 
  };
  
  const uniqueNumber = generateThreeDigitNumber(); 

  const handleFormSubmit = async () => {
    const newErrors = {};
    feedbackFields.forEach((field) => {
      if (field.isRequired && !formData[field.FormChildId]) {
        newErrors[field.FormChildId] = field.errorMessage || 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {  
      const feedbackData = feedbackFields.map(field => ({
        fieldId: field.FormChildId,
        [field.type]: formData[field.FormChildId] || ''
      }));
      const response = await fetch('https://mailing.rayaninfosolutions.in/api/submitFeedback', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FormId, feedbackFields: feedbackData, uniqueNumber })
      });
      if (response.ok) {
        localStorage.setItem(`feedbackSubmitted_${FormId}`, FormId);
        setShowModal(false);
        window.location.reload();
      } else {
        window.localStorage.removeItem("feedbackSubmitted");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
    
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/About">About</a></li>
              <li className="nav-item"><a className="nav-link" href="/Services">Services</a></li>
              <li className="nav-item"><a className="nav-link" href="/Contact">Contact Us.</a></li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="button" onClick={handleAdminForm}>Admin</button>
            </form>
          </div>
        </div>
      </nav>
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{formName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  {feedbackFields.map((field, index) => (
                    <div className="mb-3" key={index}>
                      <label className='form-label fw-semibold' style={{fontSize: '15px'}}>{field.headingLabel}{field.isRequired &&<span className='text-danger'>*</span>}</label>
                      {field.type === 'Textarea' && <textarea className={`form-control ${errors[field.FormChildId] ? 'border-danger' : ''}`} value={formData[field.FormChildId] || ''} onChange={(e) => handleInputChange(e, field.FormChildId)}></textarea>}
                      {field.type === 'Numeric rating' && (
                          <div className="d-flex">
                              {[...Array(10)].map((_, i) => (
                                  <div key={i} className="px-3 py-1 border border-secondary" onClick={() => handleNumericRatingClick(i, field.FormChildId)} style={{backgroundColor: formData[field.FormChildId] === i + 1 ? `rgba(0, 243, 0, ${(i + 1) / 10})` : '', cursor: 'pointer'}}>{i + 1}</div>
                              ))}
                          </div>
                      )}
                      {field.type === 'Star rating' && (
                          <div className="d-flex">
                              {[...Array(5)].map((_, i) => (
                                  <i key={i} className="bi bi-star p-2"   onClick={() => handleStarRatingClick(i, field.FormChildId)} style={{ color: formData[field.FormChildId] > i ? '#FFD700' : '#000', cursor: 'pointer',}}></i>
                              ))}
                          </div>
                      )}
                      {field.type === 'Smiley rating' && (
                          <div className="d-flex">
                              {['bi-emoji-angry', 'bi-emoji-frown', 'bi-emoji-neutral', 'bi-emoji-smile', 'bi-emoji-laughing'].map((iconClass, i) => (
                                  <i key={i} className={`bi ${iconClass} p-2`} style={{ fontSize: '24px', cursor: 'pointer', color: getSmileyColor(i), opacity: formData[field.FormChildId] > i ? '1' : '0.5' }} onClick={() => handleSmileyRatingClick(i, field.FormChildId)}></i>
                              ))}
                          </div>
                      )}
                      {field.type === 'Single line input' && <input className={`form-control ${errors[field.FormChildId] ? 'border-danger' : ''}`} type='text' value={formData[field.FormChildId] || ''} onChange={(e) => handleInputChange(e, field.FormChildId)} /> }
                      {field.type === 'Radio button' && 
                         field.options.map((option, optionIndex) => (
                              <div className="form-check" key={optionIndex}>
                                  <input className="form-check-input" type="radio" name={`radio-${index}`} id={`radio-${index}-${optionIndex}`} value={option} checked={formData[field.FormChildId] ? formData[field.FormChildId].includes(option) : false} onChange={(e) => handleFieldChange(e, field.FormChildId)} />
                                  <label className="form-check-label" htmlFor={`radio-${index}-${optionIndex}`}>{option}</label>
                              </div>
                          ))
                      }
                      {field.type === 'Categories' && 
                         field.options.map((option, optionIndex) => (
                              <div className='categories-wrapper' key={optionIndex}>
                                 <input name={`category-${index}`} id={`category-${index}-${optionIndex}`} type="radio" value={option} checked={Array.isArray(formData[field.FormChildId]) && formData[field.FormChildId].includes(option)} onChange={(e) => handleFieldChange(e, field.FormChildId)}  />
                                 <label htmlFor={`category-${index}-${optionIndex}`}>{option}</label>
                              </div>
                          ))
                      }
                      {errors[field.FormChildId] && (
                        <div className="text-danger">{errors[field.FormChildId]}</div>
                      )}
                    </div>
                  ))}
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>Submit Feedback</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
