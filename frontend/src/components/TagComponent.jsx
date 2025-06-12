import React from 'react';
import { Badge } from "@mantine/core";

export default function TagComponent({tag, onClick}) {

    return (
        <Badge onClick={onClick} autoContrast color={hexToRgba(tag.color)} size="lg">
            {tag.name}
        </Badge>
    );
}

export function hexToRgba(hex, alpha = 1) {
    hex = hex.replace(/^#/, '');

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}