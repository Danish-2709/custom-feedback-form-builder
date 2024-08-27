const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const app = express();
process.env.TZ = 'UTC';
app.use(cookieParser());
app.use(session({ secret: 'H#k7^P3wLs&Rt@9v!ZnY5qR8zFkA2eV', resave: false, saveUninitialized: true  })); 
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(cors(''));

const config = {
  user: 'rayanTeachLink',
  password: '@Rayan123#',
  server: '103.211.202.109',
  database: 'TeachLink',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const sqlServerCon = new sql.ConnectionPool(config);

sqlServerCon.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch(err => {
    console.error('Error connecting to SQL Server', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the root of the School server!');
});
/*----------------------------------------------------------------
----------------End API For Create Enquiry page-------------------
--------------------------------------------------------------- */
app.post('/api/generateFeedbackform', async (req, res) => {
  const { editFeedbackLabel, fields, urlCondition, date, time, publishType } = req.body;
  console.log(req.body);

  const formattedTime = time ? new Date(`2000-01-01T${time}`) : null;

  const transaction = new sql.Transaction(sqlServerCon);

  try {
    await transaction.begin();
    console.log('Transaction begun');

    // Insert into FeedbackParent
    const primarySql = `
      INSERT INTO [FeedbackParent] (FormName, URLCondition, Date, Time, SaveType, SDate)
      OUTPUT INSERTED.FormId
      VALUES (@editFeedbackLabel, @urlCondition, @date, @time, @publishType, GETDATE());
    `;

    const primaryRequest = new sql.Request(transaction);
    primaryRequest.input('editFeedbackLabel', sql.NVarChar(100), editFeedbackLabel);
    primaryRequest.input('urlCondition', sql.NVarChar(150), urlCondition);
    primaryRequest.input('date', sql.Date, date || null);
    primaryRequest.input('time', sql.Time(3), formattedTime || null);
    primaryRequest.input('publishType', sql.NVarChar(255), publishType);

    const primaryResult = await primaryRequest.query(primarySql);
    if (primaryResult && primaryResult.recordset.length > 0) {
      const generatedFormId = primaryResult.recordset[0].FormId;
      if (!generatedFormId) {
        throw new Error('Failed to retrieve generated FormId from FeedbackParent.');
      }

      // Insert into FeedbackChild
      const insertSql = `
        INSERT INTO [FeedbackChild] (FormId, Label, Validation, Error, Options, FieldType)
        VALUES (@formId, @headingLabel, @isRequired, @errorMessage, @optionsString, @type);
      `;

      for (const field of fields) {
        const { headingLabel, isRequired, errorMessage, options, type } = field;
        const optionsString = options ? JSON.stringify(options) : null;

        const fieldRequest = new sql.Request(transaction);
        fieldRequest.input('formId', sql.Int, generatedFormId);  // Use generatedFormId
        fieldRequest.input('headingLabel', sql.VarChar(150), headingLabel);
        fieldRequest.input('isRequired', sql.Bit, isRequired ? 1 : 0); 
        fieldRequest.input('errorMessage', sql.VarChar(100), errorMessage);
        fieldRequest.input('optionsString', sql.Text, optionsString);
        fieldRequest.input('type', sql.VarChar(50), type);

        await fieldRequest.query(insertSql);
      }
    }

    console.log('Feedback Form Generated successfully');
    await transaction.commit();
    console.log('Transaction committed successfully');
    res.status(200).json({ success: true, message: 'Feedback Form Generated successfully' });
  } catch (error) {
    console.error('Error:', error);

    try {
      await transaction.rollback();
      console.log('Transaction rolled back due to error');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }

    res.status(500).json({ success: false, error: 'Failed to generate feedback form' });
  }
});

app.post('/api/getFeedbackForm', async (req, res) => {

  let Sql = `select FormId, FormName, URLCondition, Date, Time, SaveType, ViewCount, ViewSubmission, SDate From FeedbackParent`; 

  const request = new sql.Request(sqlServerCon);

  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
    }
  });
});

app.put('/api/UpdateSaveType', async (req, res) => {

  const transaction = new sql.Transaction(sqlServerCon);

  try {
    await transaction.begin();
    console.log('Transaction begun');

    const primarySql = `
      Update [FeedbackParent] SET SaveType = 'Publish', SDate = GETDATE()`;

    const primaryRequest = new sql.Request(transaction);

    await primaryRequest.query(primarySql);

    await transaction.commit();
    res.status(200).json({ success: true, message: 'Feedback Form Published successfully' });
  } catch (error) {
    console.error('Error:', error);

    try {
      await transaction.rollback();
      console.log('Transaction rolled back due to error');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }

    res.status(500).json({ success: false, error: 'Failed to publish feedback form' });
  }
});

app.get('/api/updateFeedbackForm/:FormId', async (req, res) => {
  const FormId = req.params.FormId;

  const Sql = `	SELECT URLCondition, Date, Time, FormChildId, Label, Validation, Error, Options, FieldType from FeedbackParent 
	inner join FeedbackChild on FeedbackChild.FormId = FeedbackParent.FormId WHERE FeedbackParent.FormId = @FormId`;

  const request = new sql.Request(sqlServerCon);
  request.input('FormId', sql.Int, FormId);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json([result]);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/updateFeedbackFormFields/:FormId', async (req, res) => {
  const FormId = req.params.FormId;
  const { editFeedbackLabel, fields, urlCondition, date, time, publishType } = req.body;
  console.log(req.body);

  const formattedTime = time ? new Date(`2000-01-01T${time}`) : null;
  const transaction = new sql.Transaction(sqlServerCon);

  try {
    await transaction.begin();
    console.log('Transaction begun');

    const primarySql = `
      UPDATE [FeedbackParent] 
      SET FormName = @editFeedbackLabel, 
          URLCondition = @urlCondition, 
          Date = @date, 
          Time = @time, 
          SaveType = @publishType, 
          SDate = GETDATE() 
      WHERE FormId = @FormId`;

    const primaryRequest = new sql.Request(transaction);
    primaryRequest.input('FormId', sql.Int, FormId);
    primaryRequest.input('editFeedbackLabel', sql.NVarChar(100), editFeedbackLabel);
    primaryRequest.input('urlCondition', sql.NVarChar(150), urlCondition);
    primaryRequest.input('date', sql.Date, date || null);
    primaryRequest.input('time', sql.Time(3), formattedTime || null);
    primaryRequest.input('publishType', sql.NVarChar(255), publishType);

    await primaryRequest.query(primarySql);

    // SQL Queries for Update and Insert
    const updateChildSql = `
      UPDATE [FeedbackChild] 
      SET Label = @headingLabel, 
          Validation = @isRequired, 
          Error = @errorMessage, 
          Options = @optionsString, 
          FieldType = @type 
      WHERE FormChildId = @FormChildId`;

    const insertChildSql = `
      INSERT INTO [FeedbackChild] (FormId, Label, Validation, Error, Options, FieldType)
      VALUES (@FormId, @headingLabel, @isRequired, @errorMessage, @optionsString, @type)`;

    for (const field of fields) {
      const { headingLabel, isRequired, errorMessage, options, type, FormChildId } = field;
      const optionsString = options ? JSON.stringify(options) : null;

      if (FormChildId) {
        // Update existing field
        const fieldRequest = new sql.Request(transaction);
        fieldRequest.input('FormChildId', sql.Int, FormChildId);
        fieldRequest.input('headingLabel', sql.VarChar(150), headingLabel);
        fieldRequest.input('isRequired', sql.Bit, isRequired ? 1 : 0);
        fieldRequest.input('errorMessage', sql.VarChar(100), errorMessage);
        fieldRequest.input('optionsString', sql.Text, optionsString);
        fieldRequest.input('type', sql.VarChar(50), type);

        await fieldRequest.query(updateChildSql);
      } else {
        // Insert new field
        const insertRequest = new sql.Request(transaction);
        insertRequest.input('FormId', sql.Int, FormId);
        insertRequest.input('headingLabel', sql.VarChar(150), headingLabel);
        insertRequest.input('isRequired', sql.Bit, isRequired ? 1 : 0);
        insertRequest.input('errorMessage', sql.VarChar(100), errorMessage);
        insertRequest.input('optionsString', sql.Text, optionsString);
        insertRequest.input('type', sql.VarChar(50), type);

        await insertRequest.query(insertChildSql);
      }
    }

    console.log('Feedback Form Updated successfully');
    await transaction.commit(); // Commit transaction
    console.log('Transaction committed successfully');
    res.status(200).json({ success: true, message: 'Feedback Form Updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    try {
      await transaction.rollback(); // Rollback transaction
      console.log('Transaction rolled back due to error');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
    res.status(500).json({ success: false, error: 'Failed to update feedback form' });
  }
});

app.delete('/api/DeleteForm/:FormId', (req, res) => {
  const FormId = req.params.FormId;
  const Deletesql = `DELETE FROM FeedbackChild WHERE FormId = @FormId
  DELETE FROM Feedback WHERE FormId = @FormId
  DELETE FROM FeedbackParent WHERE FormId = @FormId`

  const request = new sql.Request(sqlServerCon);
  request.input('FormId', sql.Int, FormId);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/DeleteFormChild/:FormChildId', (req, res) => {
  const FormChildId = req.params.FormChildId;
  const Deletesql = `DELETE FROM FeedbackChild WHERE FormChildId = @FormChildId`

  const request = new sql.Request(sqlServerCon);
  request.input('FormChildId', sql.Int, FormChildId);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/getFeedbackToShowOnWebsite', async (req, res) => {

  let Sql = `select FeedbackParent.FormId, FormChildId, FormName, URLCondition, Date, Time, SDate, Label, Validation, Error, Options, FieldType From FeedbackParent
  inner join FeedbackChild on FeedbackChild.FormId = FeedbackParent.FormId WHERE SaveType = 'Publish'`; 

  const request = new sql.Request(sqlServerCon);

  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
    }
  });
});

app.post('/api/incrementFeedbackViewCount', async (req, res) => {
  const { formId } = req.body;
  console.log(req.body);

  const transaction = new sql.Transaction(sqlServerCon);

  try {
    await transaction.begin();

    const primarySql = `Update [FeedbackParent] SET ViewCount = isnull(ViewCount,0)+1 WHERE FormId = @formId`;

    const primaryRequest = new sql.Request(transaction);
    primaryRequest.input('formId', sql.Int, formId)

    await primaryRequest.query(primarySql);

    await transaction.commit();
    res.status(200).json({ success: true, message: 'View count incremented successfully' });
    console.log('View count incremented successfully');
  } catch (error) {
    console.error('Error:', error);

    try {
      await transaction.rollback();
      console.log('Transaction rolled back due to error');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }

    res.status(500).json({ success: false, error: 'Failed to increment View count' });
  }
});

app.post('/api/submitFeedback', async (req, res) => {
  const { FormId, feedbackFields, uniqueNumber } = req.body;
  console.log(req.body);

  const transaction = new sql.Transaction(sqlServerCon);

  try {
    await transaction.begin();
    console.log('Transaction begun');

    for (const field of feedbackFields) {
      const { fieldId, Textarea, 'Numeric rating': Numeric, 'Star rating': Star, 'Smiley rating': Smiley, 'Single line input': Input, 'Radio button': ROptions, 'Categories': COptions } = field;

      let insertChildSql = `INSERT INTO [Feedback] (FormId, FormChildId, SDate, UUId`;
      let insertValuesSql = `VALUES (@FormId, @fieldId, GETDATE(), @uniqueNumber`;

      if (Textarea !== undefined) {
        insertChildSql += `, [TextArea]`;
        insertValuesSql += `, @TextArea`;
      }
      if (Numeric !== undefined) {
        insertChildSql += `, [Numeric]`;
        insertValuesSql += `, @Numeric`;
      }
      if (Star !== undefined) {
        insertChildSql += `, [Star]`;
        insertValuesSql += `, @Star`;
      }
      if (Smiley !== undefined) {
        insertChildSql += `, [Smiley]`;
        insertValuesSql += `, @Smiley`;
      }
      if (Input !== undefined) {
        insertChildSql += `, [Input]`;
        insertValuesSql += `, @Input`;
      }
      if (ROptions !== undefined) {
        insertChildSql += `, [ROptions]`;
        insertValuesSql += `, @ROptions`;
      }
      if (COptions !== undefined) {
        insertChildSql += `, [COptions]`;
        insertValuesSql += `, @COptions`;
      }

      insertChildSql += `) `;
      insertValuesSql += `)`;

      const insertSql = `${insertChildSql} ${insertValuesSql}`;

      const fieldRequest = new sql.Request(transaction);
      fieldRequest.input('FormId', sql.Int, FormId);
      fieldRequest.input('fieldId', sql.Int, fieldId);
      fieldRequest.input('uniqueNumber', sql.Int, uniqueNumber);
      if (Textarea !== undefined) fieldRequest.input('TextArea', sql.NVarChar('MAX'), Textarea);
      if (Numeric !== undefined) fieldRequest.input('Numeric', sql.Int, Numeric);
      if (Star !== undefined) fieldRequest.input('Star', sql.Int, Star);
      if (Smiley !== undefined) fieldRequest.input('Smiley', sql.Int, Smiley);
      if (Input !== undefined) fieldRequest.input('Input', sql.NVarChar(150), Input);
      if (ROptions !== undefined) fieldRequest.input('ROptions', sql.NVarChar(50), ROptions);
      if (COptions !== undefined) fieldRequest.input('COptions', sql.NVarChar(50), COptions);

      await fieldRequest.query(insertSql);
    }

    const primarySql = `UPDATE [FeedbackParent] SET ViewSubmission = ISNULL(ViewCount, 0) + 1 WHERE FormId = @FormId`;
    const primaryRequest = new sql.Request(transaction);
    primaryRequest.input('FormId', sql.Int, FormId);
    await primaryRequest.query(primarySql);

    console.log('Feedback Form Submitted successfully');
    await transaction.commit(); 
    res.status(200).json({ success: true, message: 'Feedback Form Submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    try {
      await transaction.rollback(); 
      console.log('Transaction rolled back due to error');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
    res.status(500).json({ success: false, error: 'Failed to submit feedback form' });
  }
});

app.get('/api/viewFeedbackForm/:FormId', async (req, res) => {
  const FormId = req.params.FormId;

  const Sql = `SELECT Distinct UUId, FeedbackParent.FormId, FormName, URLCondition, Date, Time, ViewCount, ViewSubmission, FeedbackParent.SDate From FeedbackParent
  INNER JOIN Feedback ON Feedback.FormId = FeedbackParent.FormId
  WHERE FeedbackParent.FormId = @FormId`;

  const request = new sql.Request(sqlServerCon);
  request.input('FormId', sql.Int, FormId);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/viewFeedbackFormMoreDetails/:UUId', async (req, res) => {
  const UUId = req.params.UUId;

  const Sql = ` SELECT Label, Options, FieldType, FeedbackChild.FormChildId, TextArea, Numeric, Star, Smiley, Input, ROptions, COptions, Feedback.SDate as FeedDate FROM Feedback
  INNER JOIN FeedbackChild ON FeedbackChild.FormChildId = Feedback.FormChildId WHERE  UUId = @UUId order by FeedbackChild.FormChildId`;

  const request = new sql.Request(sqlServerCon);
  request.input('UUId', sql.Int, UUId);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});
/*----------------------------------------------------------------
----------------End API For Registration page---------------------
--------------------------------------------------------------- */
// app.use(express.static('./build'));
// app.get('*', (req, res) => {
// res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

app.post('/api/stop-server', (req, res) => {
  console.log('stop-server Called')
  res.send('Server is shutting down...');

  server.close(() => {
      console.log('Server stopped');
      process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = router;