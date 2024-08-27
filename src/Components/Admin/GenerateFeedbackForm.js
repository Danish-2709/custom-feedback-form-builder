import React, { useState, useEffect } from 'react';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function GenerateFeedbackForm() {
    const {feedbackLabel, FormId} = useParams();
    const [editFeedbackLabel, setEditFeedbackLabel] = useState('');
    const [editingFieldIndex, setEditingFieldIndex] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [fieldDetails, setFieldDetails] = useState({ headingLabel: '', isRequired: false, errorMessage: '', options: [''], FormChildId: '', });
    const [fields, setFields] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedStar, setSelectedStar] = useState(null);
    const [selectedSmiley, setSelectedSmiley] = useState(null);
    const [isUrlConditionSwitchOn, setIsUrlConditionSwitchOn] = useState(false);
    const [urlCondition, setUrlCondition] = useState('');
    const [isDateSwitchOn, setIsDateSwitchOn] = useState(false);
    const [date, setDate] = useState('');
    const [isTimeSwitchOn, setIsTimeSwitchOn] = useState(false);
    const [time, setTime] = useState('');
    const [DeleteId, setDeleteId] = useState(''); 
    const [isDeleted, setIsDeleted] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [messageModal, setMessageModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [successMessage, setSuccessMessage] = useState('');
    const [failureMessage, setFailureMessage] = useState('');
    const navigate = useNavigate();

    const removeSuccessMessage = () => {
        setSuccessMessage('');
        setMessageModal(false);
      };  

    const handleEditFeedbackLabelChange = (e) => {
        setEditFeedbackLabel(e.target.value)
    }

    useEffect(() => {
        setEditFeedbackLabel(feedbackLabel);
    }, [feedbackLabel]);

    const handleGoBack = () => {
        navigate(`/admin/Dashboard`)
    }

    const handleFieldClick = (fieldType) => {
        setSelectedField(fieldType);
    }

    const handleFieldDetailsChange = (e, index = null) => {
        const { name, value, type, checked } = e.target;

        if (name === 'options') {
            const updatedOptions = [...fieldDetails.options];
            updatedOptions[index] = value;
            setFieldDetails({ ...fieldDetails, options: updatedOptions });
        }

        if(name === 'options' && index !== null){
            const newOptions = [...fieldDetails.options];
            newOptions[index] = value;
            setFieldDetails((prev) => ({
              ...prev,
              options: newOptions,
            }));
        } else {
            setFieldDetails(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }

    const handleSaveField = () => {
        if (editingFieldIndex !== null) {
            const updatedFields = [...fields];
            updatedFields[editingFieldIndex] = {
                ...updatedFields[editingFieldIndex],
                headingLabel: fieldDetails.headingLabel,
                isRequired: fieldDetails.isRequired,
                errorMessage: fieldDetails.errorMessage,
                options: fieldDetails.options,
            };
            setFields(updatedFields);
            setEditingFieldIndex(null); 
            setFieldDetails({ headingLabel: '', isRequired: false, errorMessage: '', options: [] });
            setSelectedField(null); 
        } else {
            setFields(prev => [...prev, { ...fieldDetails, type: selectedField }]);
            setFieldDetails({ headingLabel: '', isRequired: false, errorMessage: '', options: [] });
            setSelectedField(null);
        }
    }

    const handleDeleteField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const addOption = () => {
        setFieldDetails((prev) => ({
          ...prev,
          options: [...prev.options, ''], 
        }));
    };
    
    const removeOption = (index) => {
        setFieldDetails((prev) => ({
          ...prev,
          options: prev.options.filter((_, i) => i !== index),
        }));
    };

    const handleNumericRatingClick = (index) => {
        setSelectedRating(index + 1);
    };

    const handleStarRatingClick = (index) => {
        setSelectedStar(index + 1);
    };

    const handleSmileyRatingClick = (index) => {
        setSelectedSmiley(index + 1);
    };

    const getSmileyColor = (index) => {
        const colors = ['#FF0000', '#FF4500', '#FFD700', '#ADFF2F', '#008000'];
        return colors[index];
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
    
        const reorderedFields = Array.from(fields);
        const [movedItem] = reorderedFields.splice(result.source.index, 1);
        reorderedFields.splice(result.destination.index, 0, movedItem);
    
        setFields(reorderedFields);
    };
    
    const handleEditFieldClick = (index) => {
        setSelectedField(fields[index].type); 
        setFieldDetails({
            headingLabel: fields[index].headingLabel || '',
            isRequired: fields[index].isRequired || false,
            errorMessage: fields[index].errorMessage || '',
            options: fields[index].options || [], 
        });
        setEditingFieldIndex(index);
    };

    const handleURLConditionSwitchToggle = () => {
        setIsUrlConditionSwitchOn(!isUrlConditionSwitchOn);
    };

    const handleURLConditionChnage = (e) => {
        setUrlCondition(e.target.value); 
    };

    const handleDateSwitchToggle = () => {
        setIsDateSwitchOn(!isDateSwitchOn);
    };

    const handleDateChnage = (e) => {
        setDate(e.target.value); 
    };

    const handleTimeSwitchToggle = () => {
        setIsTimeSwitchOn(!isTimeSwitchOn);
    };

    const handleTimeChnage = (e) => {
        setTime(e.target.value); 
    };

    const handleSaveSubmit = async (e) => {
        if ((isUrlConditionSwitchOn) && urlCondition === '') {
          alert('Oops! The URL Field Is Empty');
          return;
        } else if ((isDateSwitchOn) && !date){
          alert('Oops! The Date Field Is Empty');
          return;
        } else if ((isTimeSwitchOn) && !time){
          alert('Oops! The Time Field Is Empty');
          return;
        } 

        // e.preventDefault();
        
        if (isSubmitting) {
          return; 
        }
        setIsSubmitting(true); 
        if(FormId){
            try {
                const response = await fetch(`https://mailing.rayaninfosolutions.in/api/updateFeedbackFormFields/${FormId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ editFeedbackLabel, fields, urlCondition, date: isDateSwitchOn ? date : null,  time: isTimeSwitchOn ? time : null, publishType: 'Save' }),
                });
                if (response.ok) {
                  const data = await response.json(); 
                  setMessageModal(true);
                  setFailureMessage('');
                  setSuccessMessage(data.message);
                  setEditFeedbackLabel('');
                  setUrlCondition('');
                  setDate('');
                  setTime('');
                  setFields([]);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000);
                  navigate(`/admin/Dashboard`) 
                } else {
                  const data = await response.json();
                  setMessageModal(true);
                  setSuccessMessage('');
                  setFailureMessage(data.error);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000); 
                }
                } catch (error) {
                  console.error('Error uploading', error);
                }
        } else {
            try {
                const response = await fetch(`https://mailing.rayaninfosolutions.in/api/generateFeedbackform`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ editFeedbackLabel, fields, urlCondition, date: isDateSwitchOn ? date : null,  time: isTimeSwitchOn ? time : null, publishType: 'Save' }),
                });
                if (response.ok) {
                  const data = await response.json(); 
                  setMessageModal(true);
                  setFailureMessage('');
                  setSuccessMessage(data.message);
                  setEditFeedbackLabel('');
                  setUrlCondition('');
                  setDate('');
                  setTime('');
                  setFields([]);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000);
                  navigate(`/admin/Dashboard`) 
                } else {
                  const data = await response.json();
                  setMessageModal(true);
                  setSuccessMessage('');
                  setFailureMessage(data.error);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000); 
                }
                } catch (error) {
                  console.error('Error uploading', error);
                }
        }
        setIsSubmitting(false);
    }

    const handlePublishSubmit = async (e) => {
        if ((isUrlConditionSwitchOn) && urlCondition === '') {
          alert('Oops! The URL Field Is Empty');
          return;
        } else if ((isDateSwitchOn) && !date){
          alert('Oops! The Date Field Is Empty');
          return;
        } else if ((isTimeSwitchOn) && !time){
          alert('Oops! The Time Field Is Empty');
          return;
        } 

        // e.preventDefault();
        
        if (isSubmitting) {
          return; 
        }
        setIsSubmitting(true); 
        if(FormId){
            try {
                const response = await fetch(`https://mailing.rayaninfosolutions.in/api/updateFeedbackFormFields/${FormId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ editFeedbackLabel, fields, urlCondition, date: isDateSwitchOn ? date : null,  time: isTimeSwitchOn ? time : null, publishType: 'Publish' }),
                });
                if (response.ok) {
                  const data = await response.json(); 
                  setMessageModal(true);
                  setFailureMessage('');
                  setSuccessMessage(data.message);
                  setEditFeedbackLabel('');
                  setUrlCondition('');
                  setDate('');
                  setTime('');
                  setFields([]);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000);
                  navigate(`/admin/Dashboard`) 
                } else {
                  const data = await response.json();
                  setMessageModal(true);
                  setSuccessMessage('');
                  setFailureMessage(data.error);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000); 
                }
                } catch (error) {
                  console.error('Error uploading', error);
                }
        } else {
            try {
                const response = await fetch(`https://mailing.rayaninfosolutions.in/api/generateFeedbackform`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ editFeedbackLabel, fields, urlCondition, date: isDateSwitchOn ? date : null,  time: isTimeSwitchOn ? time : null, publishType: 'Publish' }),
                });
                if (response.ok) {
                  const data = await response.json(); 
                  setMessageModal(true);
                  setFailureMessage('');
                  setSuccessMessage(data.message);
                  setEditFeedbackLabel('');
                  setUrlCondition('');
                  setDate('');
                  setTime('');
                  setFields([]);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000);
                  navigate(`/admin/Dashboard`) 
                } else {
                  const data = await response.json();
                  setMessageModal(true);
                  setSuccessMessage('');
                  setFailureMessage(data.error);
                  setTimeout(() => {
                    removeSuccessMessage();
                  }, 2000); 
                }
                } catch (error) {
                  console.error('Error uploading', error);
                }
        }
        setIsSubmitting(false);
    }

    useEffect(() => {
        if (FormId) {
          fetch(`https://mailing.rayaninfosolutions.in/api/updateFeedbackForm/${FormId}`)
            .then((response) => response.json())
            .then((result) => {
              if (result && result.length > 0) {
                const data = result[0].recordset; 
                if(data[0].URLCondition){
                    setIsUrlConditionSwitchOn(true);
                    setUrlCondition(data[0].URLCondition || '');
                }
                if(data[0].Date){
                    setIsDateSwitchOn(true);
                    setDate(data[0].Date.slice(0, 10) || '');
                }
                if(data[0].Time){
                    setIsTimeSwitchOn(true);
                    setTime(data[0].Time.slice(11, 16) || '');
                }
                const mappedFields = data.map((field) => ({
                    type: field.FieldType,
                    headingLabel: field.Label,
                    isRequired: field.Validation === "1",
                    errorMessage: field.Error,
                    options: JSON.parse(field.Options), 
                    FormChildId: field.FormChildId,
                }));
                setFields(mappedFields);
              } else {
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
          } else {
            setUrlCondition('');
            setDate('');
            setTime('');
            setFields([]);
          }
    }, [FormId]);

    const handleConfirmation = async (FormChildId) => {
      setIsDeleted(true);
      setDeleteId(FormChildId)
    };
  
    const handleCancel = async () => {
      setIsDeleted(false);
      setDeleteId('')
    };
  
    const handleDelete = async (FormChildId) => {
      try {
        const response = await fetch(`https://mailing.rayaninfosolutions.in/api/DeleteFormChild/${FormChildId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setFields((prevData) => prevData.filter(item => item.FormChildId !== FormChildId));
          setFailureMessage('');
          setSuccessMessage('Field Deleted successfully.');
          setMessageModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 2000);
          setIsDeleted(false);
          setDeleteId('')
        } else {
          setSuccessMessage('');
          setFailureMessage('Failed To Delete Field.');
          setMessageModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 2000);
        }
      } catch (error) {
        console.error('Error deleting Section:', error);
      }
    };
    
  return (
    <>
        {messageModal && (
          <div className="modal-backdrop show"></div>
        )}
        <div className={`modal fade ${messageModal ? 'show' : ''}`} style={{ display: messageModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
                <div className="modal-header border-bottom-0">
                  <h5 className="modal-title">Message</h5>
                </div>
                <div className="modal-body">
                    {successMessage && <span className='text-success'>{successMessage}</span>}
                    {failureMessage && <span className='text-danger'>{failureMessage}</span>}
                </div>
              </div>
            </div>
        </div> 
        {showModal && (
          <div className="modal-backdrop show"></div>
        )}
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
                <div className="modal-header border-bottom-0">
                  <h5 className="modal-title">Edit Feedback Form</h5>
                </div>
                <div className="modal-body">
                    <input className='form-control border-0 border-bottom' value={editFeedbackLabel} onChange={handleEditFeedbackLabelChange} />
                </div>
                <div className='d-flex flex-row-reverse '>
                  <button className='btn btn-secondary mx-2' onClick={() => setShowModal(false)}>Cancel</button>
                  <button className='btn btn-success mx-2' onClick={() => setShowModal(false)}>Update</button>
                </div>
              </div>
            </div>
        </div> 
        <nav className="navbar bg-white shadow-sm p-3 mb-0 rounded sticky-top">
          <div className="w-100">
           <div className='d-flex justify-content-between'>
            <span className="navbar-brand mb-0 h1">
               <div style={{ position: 'relative', display: 'inline-block' }}>
                 <ChatBubbleOutlineOutlinedIcon style={{ fontSize: '40px' }} />
                 <ThumbUpIcon
                   style={{
                     color: 'blue',
                     position: 'absolute',
                     top: '7px', 
                     left: '50%', 
                     transform: 'translateX(-50%)', 
                     fontSize: '20px',
                   }}
                 />
               </div>
               USER FEEDBACK
            </span>
            <div className='d-flex my-2'>
              <button className='btn btn-primary' onClick={() => {handleSaveSubmit()}}>{FormId ? 'Update' : 'Save'}</button>
              <button className='btn btn-success mx-2' onClick={() => {handlePublishSubmit()}}>Publish</button>
            </div>
           </div>
          </div>
        </nav>
        <div className='row mx-1'>
            <div className='col-md-9 order-2 oreder-md-1 mt-3'>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className='bg-white shadow-sm mb-5 rounded card w-100 w-md-50'>
                        <div className='bg-primary text-white w-100 p-3 rounded'>
                            <span><i className="bi bi-chevron-left fs-6 me-2" onClick={() => handleGoBack()}></i>{editFeedbackLabel}<i className="bi bi-pencil-fill fs-6 ms-2" onClick={() => setShowModal(true)}></i></span>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd} >
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {fields.map((field, index) => (
                                          <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
                                            {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white shadow-sm rounded mx-2 my-2 mb-2 p-3">
                                                <label className='form-label fw-semibold' style={{fontSize: '15px'}}>{field.headingLabel}{field.isRequired &&<span className='text-danger'>*</span>}</label>
                                                {field.type === 'Textarea' && <textarea className='form-control'></textarea>}
                                                {field.type === 'Numeric rating' && (
                                                    <div className="d-flex">
                                                        {[...Array(10)].map((_, i) => (
                                                            <div key={i} className="px-3 py-1 border border-secondary" onClick={() => handleNumericRatingClick(i)} style={{backgroundColor: selectedRating === i+1 ? `rgba(0, 243, 0, ${(i + 1)/10})` : '', cursor: 'pointer'}}>{i + 1}</div>
                                                        ))}
                                                    </div>
                                                )}
                                                {field.type === 'Star rating' && (
                                                    <div className="d-flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className="bi bi-star p-2"  onClick={() => handleStarRatingClick(i)} style={{ color: selectedStar > i ? '#FFD700' : '#000', cursor: 'pointer',}}></i>
                                                        ))}
                                                    </div>
                                                )}
                                                {field.type === 'Smiley rating' && (
                                                    <div className="d-flex">
                                                        {['bi-emoji-angry', 'bi-emoji-frown', 'bi-emoji-neutral', 'bi-emoji-smile', 'bi-emoji-laughing'].map((iconClass, i) => (
                                                            <i key={i} className={`bi ${iconClass} p-2`} style={{ fontSize: '24px', cursor: 'pointer', color: getSmileyColor(i), opacity: selectedSmiley > i ? '1' : '0.5' }} onClick={() => handleSmileyRatingClick(i)}></i>
                                                        ))}
                                                    </div>
                                                )}
                                                {field.type === 'Single line input' && <input className='form-control' type='text' /> }
                                                {field.type === 'Radio button' && 
                                                   field.options.map((option, optionIndex) => (
                                                        <div className="form-check" key={optionIndex}>
                                                            <input className="form-check-input" type="radio" name={`radio-${index}`} id={`radio-${index}-${optionIndex}`} />
                                                            <label className="form-check-label" htmlFor={`radio-${index}-${optionIndex}`}>{option}</label>
                                                        </div>
                                                    ))
                                                }
                                                {field.type === 'Categories' && 
                                                   field.options.map((option, optionIndex) => (
                                                        <div className='categories-wrapper' key={optionIndex}>
                                                           <input name={`category-${index}`} id={`category-${index}-${optionIndex}`} type="radio" value={option}  />
                                                           <label htmlFor={`category-${index}-${optionIndex}`}>{option}</label>
                                                        </div>
                                                    ))
                                                }
                                                <div className='d-flex flex-row-reverse my-2'>
                                                  <i className="bi bi-trash-fill fs-6 px-2 text-secondary" onClick={() => {if(FormId){handleConfirmation(field.FormChildId)}else{handleDeleteField(index)}}}></i>
                                                  <i className="bi bi-pencil-fill fs-6 px-2 text-secondary" onClick={() => handleEditFieldClick(index)}></i>
                                                </div>
                                            </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
            <div className='col-md-3 order-1 order-md-2 bg-white shadow-sm p-3 mb-5 rounded'>
               {!selectedField && <div>
                    <h5 className='font-size-family'>Add fields</h5>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Textarea')}>
                        <span><i className="bi bi-textarea-resize fs-6 pe-2"></i>Textarea</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Numeric rating')}>
                        <span><i className="bi bi-sort-numeric-down fs-6 pe-2"></i>Numeric rating</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Star rating')}>
                        <span><i className="bi bi-star fs-6 pe-2"></i>Star rating</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Smiley rating')}>
                        <span><i className="bi bi-emoji-smile fs-6 pe-2"></i>Smiley rating</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Single line input')}>
                        <span><i className="bi bi-input-cursor-text fs-6 pe-2"></i>Single line input</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor' onClick={() => handleFieldClick('Radio button')}>
                        <span><i className="bi bi-ui-radios fs-6 pe-2"></i>Radio button</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='d-flex justify-content-between align-items-center my-2 cursor'  onClick={() => handleFieldClick('Categories')}>
                        <span><i className="bi bi-list-columns fs-6 pe-2"></i>Categories</span><AddOutlinedIcon style={{color: 'blue', fontSize: '30px'}} />
                    </div>
                    <div className='my-2'>
                        <label className='form-label fw-semibold d-flex justify-content-between align-items-center' style={{fontSize: '15px'}}>
                            Show based on URL conditions 
                            <div className="form-check form-switch ms-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isUrlConditionSwitchOn} onChange={handleURLConditionSwitchToggle} />
                            </div>
                        </label>
                        <input className='form-control border-0 border-bottom' type='text' placeholder='http://' value={urlCondition} onChange={handleURLConditionChnage} disabled={!isUrlConditionSwitchOn} />
                    </div>
                    <div className='my-2'>
                        <label className='form-label fw-semibold d-flex justify-content-between align-items-center' style={{fontSize: '15px'}}>
                            Show on a specific date 
                            <div className="form-check form-switch ms-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isDateSwitchOn} onChange={handleDateSwitchToggle} />
                            </div>
                        </label>
                        <input className='form-control border-0 border-bottom' type='date' value={date} onChange={handleDateChnage} disabled={!isDateSwitchOn} />
                    </div>
                    <div className='my-2'>
                        <label className='form-label fw-semibold d-flex justify-content-between align-items-center' style={{fontSize: '15px'}}>
                            Show on a specific time 
                            <div className="form-check form-switch ms-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isTimeSwitchOn} onChange={handleTimeSwitchToggle} />
                            </div>
                        </label>
                        <input className='form-control border-0 border-bottom' type='time' value={time} onChange={handleTimeChnage} disabled={!isTimeSwitchOn}  />
                    </div>
                </div>}
               {selectedField && <div>
                    <h6 className='font-size-family'><i className="bi bi-chevron-left fs-6 me-2" onClick={() => setSelectedField(null)}></i>Back to Add Fields</h6>        
                    <div className='my-2'>
                        <label className='form-label fw-semibold text-primary' style={{fontSize: '15px'}}>Label</label>
                        <input className='form-control border-0 border-bottom' type='text'  name="headingLabel" value={fieldDetails.headingLabel} onChange={handleFieldDetailsChange} />
                    </div>
                    <div className='my-2'>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="isRequired" name='isRequired'  checked={fieldDetails.isRequired} onChange={handleFieldDetailsChange} />
                            <label className='form-label fw-semibold d-flex justify-content-between align-items-center' style={{fontSize: '15px'}}>Required</label>
                        </div>
                    </div>
                    {['Textarea', 'Single line input'].includes(selectedField) &&
                    <div className='my-2'>
                        <label className='form-label fw-semibold text-secondary' style={{fontSize: '15px'}}>Error message</label>
                        <input className='form-control border-0 border-bottom' type='text' name='errorMessage' placeholder='This is invalid!' value={fieldDetails.errorMessage} onChange={handleFieldDetailsChange} />
                    </div>
                    }
                    {['Radio button', 'Categories'].includes(selectedField) && (
                      <div className='my-2'>
                        <label className='form-label fw-semibold text-secondary' style={{ fontSize: '15px' }}>Options</label>
                        {fieldDetails.options.map((option, index) => (
                          <div key={index} className="d-flex align-items-center my-1">
                            <input
                              className='form-control border-0 border-bottom'
                              type='text'
                              name='options'
                              value={option}
                              onChange={(e) => handleFieldDetailsChange(e, index)}
                              placeholder={`Option ${index + 1}`}
                            />
                            <button className='btn btn-danger btn-sm mx-1' onClick={() => removeOption(index)}>
                              &times;
                            </button>
                          </div>
                        ))}
                        <button className='btn btn-info btn-sm' onClick={addOption}><AddOutlinedIcon /></button>
                      </div>
                    )}
                    <div className='d-flex my-2'>
                      <button className='btn btn-primary' onClick={handleSaveField} disabled={fieldDetails.headingLabel === ''}>{editingFieldIndex !== null ? 'Update' : 'Save'}</button>
                      <button className='btn btn-light mx-2' onClick={() => setSelectedField(null)}>Cancel</button>
                    </div>
                </div>}
            </div>
        </div>
        {isDeleted && (
            <div className="modal-backdrop show"></div>
        )}
        <div className={`modal fade ${isDeleted ? 'show' : ''}`} style={{ display: isDeleted ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
                <div className="modal-header">
                  <h5 className="modal-title">Delete <strong>Field?</strong></h5>
                </div>
                <div className="modal-body">
                  <p>This Will Delete Field <span className='text-danger'>Permannently</span></p>
                  <div className='d-flex flex-row-reverse '>
                  <button className='btn btn-danger mx-2' onClick={() => handleDelete(DeleteId)}>Delete</button>
                  <button className='btn btn-secondary mx-2' onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}
