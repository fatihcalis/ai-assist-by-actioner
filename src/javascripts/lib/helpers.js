/**
 * Resize App container
 * @param {ZAFClient} client ZAFClient object
 * @param {Number} max max height available to resize to
 * @return {Promise} will resolved after resize
 */
export function resizeContainer(client, max = Number.POSITIVE_INFINITY) {
  const newHeight = Math.min(document.body.clientHeight, max);
  return client.invoke("resize", { height: newHeight });
}

/**
 * Helper to render a dataset using the same template function
 * @param {Array} set dataset
 * @param {Function} getTemplate function to generate template
 * @param {String} initialValue any template string prepended
 * @return {String} final template
 */
export function templatingLoop(set, getTemplate, initialValue = "") {
  return set.reduce((accumulator, item, index) => {
    return `${accumulator}${getTemplate(item, index)}`;
  }, initialValue);
}

/**
 * Render template
 * @param {String} replacedNodeSelector selector of the node to be replaced
 * @param {String} htmlString new html string to be rendered
 */
export function render(replacedNodeSelector, htmlString) {
  const fragment = document.createRange().createContextualFragment(htmlString);
  const replacedNode = document.querySelector(replacedNodeSelector);

  replacedNode.parentNode.replaceChild(fragment, replacedNode);
}

/**
 * Helper to escape unsafe characters in HTML, including &, <, >, ", ', `, =
 * @param {String} str String to be escaped
 * @return {String} escaped string
 */
export function escapeSpecialChars(str) {
  if (typeof str !== "string")
    throw new TypeError(
      "escapeSpecialChars function expects input in type String"
    );

  const escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return str.replace(/[&<>"'`=]/g, function (m) {
    return escape[m];
  });
}

/**
 * Helper to convert snake case strings to sentence case
 * @param {String} string Snake case string
 * @return {String} Sentence case string
 */
export function toSentenceCase(string) {
  const finalString = string.replace(/_/g, " ");
  return finalString.charAt(0).toUpperCase() + finalString.slice(1);
}

/**
 * Helper to format ISO 8601 timestamps as human-readable datetime
 * @param {String} date ISO 8601 timestamp
 * @return {String} Formatted date. Example: Sep 1, 2099 2:55 PM
 */
export function formatDate(date) {
  const formattedDate = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return formattedDate.toLocaleDateString("en-us", options);
}
