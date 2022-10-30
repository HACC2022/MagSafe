import React from "react";

const extra_original = (url) => {
    if (url.length > 16) {
        return "..."
    } return ""
}

const extra_id = (id) => {
    if (id.length > 7) {
        return "..."
    } return ""
}

const NavBarButton = ({ compressedURL }) => {
    return (
        <div className="nav-bar-button">
            <div className="nav-bar-button-original-url">{compressedURL.original.substring(0, 16) + extra_original(compressedURL.original)}</div>
            <div className="nav-bar-button-compressed-url">{"msf.vercel.app/" + compressedURL.compressed_id.substring(0, 7) + extra_id(compressedURL.compressed_id)}</div>
        </div>
    )
}

export default NavBarButton;