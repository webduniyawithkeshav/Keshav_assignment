const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');

/**
 * Parse uploaded file (CSV, XLSX, or XLS)
 * @param {String} filePath - Path to uploaded file
 * @param {String} fileExtension - File extension (.csv, .xlsx, or .xls)
 * @returns {Promise<Array>} Array of record objects
 */
const parseFile = async (filePath, fileExtension) => {
    try {
        if (fileExtension === '.csv') {
            return await parseCSV(filePath);
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
            return parseXLSX(filePath);
        } else {
            throw new Error('Unsupported file format. Only CSV, XLSX, and XLS are allowed.');
        }
    } catch (error) {
        throw new Error(`File parsing failed: ${error.message}`);
    }
};

/**
 * Parse CSV file
 * @param {String} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of record objects
 */
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Remove empty rows
                if (Object.values(row).some((value) => value && value.trim())) {
                    results.push(row);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

/**
 * Parse XLSX file
 * @param {String} filePath - Path to XLSX file
 * @returns {Array} Array of record objects
 */
const parseXLSX = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Read first sheet
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Remove empty rows
        return data.filter((row) =>
            Object.values(row).some((value) => value && String(value).trim())
        );
    } catch (error) {
        throw new Error(`XLSX parsing failed: ${error.message}`);
    }
};

/**
 * Validate file structure and required columns
 * @param {Array} records - Array of record objects
 * @returns {Object} Validation result { isValid, errors }
 */
const validateFileStructure = (records) => {
    const errors = [];

    // Check if file is empty
    if (!records || records.length === 0) {
        return {
            isValid: false,
            errors: ['File is empty or contains no valid data'],
        };
    }

    // Check required columns exist in first record (header validation)
    const requiredColumns = ['FirstName', 'Phone', 'Notes'];
    const firstRecord = records[0];
    const actualColumns = Object.keys(firstRecord);

    const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
        return {
            isValid: false,
            errors: [`Missing required columns: ${missingColumns.join(', ')}. Expected columns: FirstName, Phone, Notes`],
        };
    }

    // Validate each record
    records.forEach((record, index) => {
        const rowNumber = index + 2; // +2 for Excel row (1-indexed + header)

        // Validate FirstName (string, required)
        if (!record.FirstName || String(record.FirstName).trim() === '') {
            errors.push(`Row ${rowNumber}: FirstName is required`);
        } else if (typeof record.FirstName !== 'string' && typeof record.FirstName !== 'number') {
            errors.push(`Row ${rowNumber}: FirstName must be a valid string`);
        }

        // Validate Phone (number, required)
        if (!record.Phone && record.Phone !== 0) {
            errors.push(`Row ${rowNumber}: Phone is required`);
        } else {
            const phoneStr = String(record.Phone).replace(/\D/g, ''); // Remove non-digits
            if (phoneStr.length < 10 || phoneStr.length > 15) {
                errors.push(`Row ${rowNumber}: Phone must be 10-15 digits`);
            }
        }

        // Validate Notes (string, required)
        if (!record.Notes && record.Notes !== '') {
            errors.push(`Row ${rowNumber}: Notes is required`);
        } else if (record.Notes && typeof record.Notes !== 'string' && typeof record.Notes !== 'number') {
            errors.push(`Row ${rowNumber}: Notes must be a valid string`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Legacy validation function (kept for backward compatibility)
 * @param {Array} records - Array of record objects
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result { isValid, errors }
 */
const validateRecords = (records, requiredFields = []) => {
    // If no required fields specified, use the new strict validation
    if (requiredFields.length === 0) {
        return validateFileStructure(records);
    }

    // Legacy validation logic
    const errors = [];

    if (!records || records.length === 0) {
        return {
            isValid: false,
            errors: ['File is empty or contains no valid data'],
        };
    }

    records.forEach((record, index) => {
        const rowNumber = index + 2;

        requiredFields.forEach((field) => {
            if (!record[field] || String(record[field]).trim() === '') {
                errors.push(`Row ${rowNumber}: Missing required field '${field}'`);
            }
        });

        // Email validation (if email field exists)
        if (record.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(record.email).trim())) {
                errors.push(`Row ${rowNumber}: Invalid email format`);
            }
        }

        // Phone validation (if phone field exists)
        if (record.phone) {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(String(record.phone).replace(/\D/g, ''))) {
                errors.push(`Row ${rowNumber}: Invalid phone format (use 10-15 digits)`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Delete uploaded file
 * @param {String} filePath - Path to file
 */
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
};

module.exports = {
    parseFile,
    validateRecords,
    validateFileStructure,
    deleteFile,
};
