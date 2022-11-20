/**
 * Returns current date formatted to yyyyMMdd@HH:mm:ss
 * @returns {string}
 */
export const getDateFormatted = () => {
    const now = new Date();
    const month = now.getMonth() + 1,
        day = now.getDate(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        seconds = now.getSeconds();
    return `${now.getFullYear()}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}@${hours < 10 ? '0' + hours : hours}${
      minutes < 10 ? '0' + minutes : minutes
    }${seconds < 10 ? '0' + seconds : seconds}`;
};

/**
 * Removes any cyrillic characters from the provided text
 * @param {string} text 
 * @returns {string}
 */
export const escapeCyrillicText = (text) => {
    return escape(text).replace(/%u/g, '\\U+').replace(/'%20/g, ' ');
};