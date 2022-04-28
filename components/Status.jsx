import React from "react";
import { Badge } from "react-bootstrap";

export default function Status({ variant, statuses }) {
    if (statuses) {
        variant = statuses.find(s => {
            return s.id === variant;
        })?.status;
    }
    if (!variant) variant = "Pending";
    return (
        <Badge bg={
            variant === "Success" ? "success" : 
                ["Warning", "Pending"].includes(variant) ? "warning" : "danger"}>
            {variant}
        </Badge>
    );
}
