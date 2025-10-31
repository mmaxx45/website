<?php

$key = $_GET["key"];
$generate = $_GET["generate"];
/**
 * Generate a License Key with Alphanumeric Checksum of Segment Length.
 *
 * This function generates a license key and appends an alphanumeric checksum
 * whose length matches the segment length for better uniformity.
 *
 * @param   string  $suffix Optional. Append this to the generated key.
 * @return  string  License key with appended checksum.
 */
function generate_license($suffix = null) {
    // Set default number of segments and segment characters
    $num_segments = 4;
    $segment_chars = 5;

    // Tokens used for license generation (ambiguous characters removed)
    $tokens = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    // Initialize license string
    $license_string = '';

    // Build default license string
    for ($i = 0; $i < $num_segments; $i++) {
        $segment = '';
        for ($j = 0; $j < $segment_chars; $j++) {
            $segment .= $tokens[rand(0, strlen($tokens) - 1)];
        }
        $license_string .= $segment;

        // Add separator unless at the last segment
        if ($i < ($num_segments - 1)) {
            $license_string .= '-';
        }
    }

    // Handle optional suffix
    if (isset($suffix)) {
        if (is_numeric($suffix)) {
            $license_string .= '-' . strtoupper(base_convert($suffix, 10, 36));
        } else {
            $long = sprintf("%u", ip2long($suffix), true);
            if ($suffix === long2ip($long)) {
                $license_string .= '-' . strtoupper(base_convert($long, 10, 36));
            } else {
                $license_string .= '-' . strtoupper(str_ireplace(' ', '-', $suffix));
            }
        }
    }

    // Generate alphanumeric checksum and append it to the license string
    $checksum = strtoupper(base_convert(md5($license_string), 16, 36));

    // Adjust the length of the checksum to match segment_chars
    $checksum = substr($checksum, 0, $segment_chars);

    $license_string .= '-' . $checksum;

    return $license_string;
}

/**
 * Verify a License Key with Alphanumeric Checksum of Segment Length.
 *
 * This function verifies a license key by checking its alphanumeric checksum
 * whose length matches the segment length.
 *
 * @param   string  $license License key to verify.
 * @return  bool    True if valid, false otherwise.
 */
function verify_license($key) {
    // Split the license key into segments by dash
    $segments = explode('-', $key);

    // Extract the checksum from the last segment
    $checksum = end($segments);

    // Remove checksum to get the base license string
    array_pop($segments);
    $license_base = implode('-', $segments);

    // Compute checksum for the base license string
    $computed_checksum = strtoupper(base_convert(md5($license_base), 16, 36));

    // Adjust the length of the computed checksum to match the original
    $computed_checksum = substr($computed_checksum, 0, strlen($checksum));

    // Verify by comparing the checksums
    return $checksum === $computed_checksum;
}
?>
<?php
//echo generate_license();
if ($generate == "ChangeMe") { //Change this value in production to a password.
    echo generate_license();
}

if ($key != null) {
echo verify_license($key) ? 'true' : 'false';
}
?>
