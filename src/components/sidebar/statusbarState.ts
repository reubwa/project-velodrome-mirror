export type StatusbarState = typeof StatusbarState[keyof typeof StatusbarState];

export const StatusbarState = {
    default : "Default",
    intermediate : "Intermediate",
    error : "Error"
}