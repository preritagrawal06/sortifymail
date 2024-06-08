export const formatText = (snippet: string) => {
    let textarea = document.createElement("textarea")
    textarea.innerHTML = snippet
    return textarea.value
}