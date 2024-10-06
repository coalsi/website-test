<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Your Google reCAPTCHA secret key
    $secret = '6LfJ4UwqAAAAACQiGlbM1_b0oZFWnzSahBcUInzw'; // Replace with your actual secret key

    // reCAPTCHA response
    $recaptcha_response = $_POST['g-recaptcha-response'];

    // Verify the reCAPTCHA response with Google
    $verify_response = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secret) . '&response=' . urlencode($recaptcha_response));
    $response_data = json_decode($verify_response);

    // Check if reCAPTCHA was successful
    if ($response_data->success) {
        // Identify the form type
        $form_type = isset($_POST['form_type']) ? $_POST['form_type'] : '';

        // Initialize variables
        $name = '';
        $email = '';
        $subject = '';
        $email_content = '';
        $email_headers = '';

        // Set the recipient email address
        $recipient = "noreply@coreysilvia.com"; // Replace with your email address

        if ($form_type === 'contact') {
            // Process Contact Form
            $name = strip_tags(trim($_POST["name"]));
            $name = str_replace(["\r", "\n"], [" ", " "], $name);

            $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

            $reason = strip_tags(trim($_POST["reason"]));

            $message = trim($_POST["message"]);

            // Check that data was sent to the mailer
            if (empty($name) || empty($reason) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo "Please complete all fields correctly.";
                exit;
            }

            // Set the email subject
            $subject = "New Contact from $name - Reason: $reason";

            // Build the email content
            $email_content = "Name: $name\n";
            $email_content .= "Email: $email\n";
            $email_content .= "Reason: $reason\n\n";
            $email_content .= "Message:\n$message\n";

            // Build the email headers
            $email_headers = "From: $name <$email>\r\n";
            $email_headers .= "Reply-To: $email\r\n";
            $email_headers .= "MIME-Version: 1.0\r\n";
            $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        } elseif ($form_type === 'web_design') {
            // Process Web Design Quote Form
            $name = strip_tags(trim($_POST["web_name"]));
            $name = str_replace(["\r", "\n"], [" ", " "], $name);

            $email = filter_var(trim($_POST["web_email"]), FILTER_SANITIZE_EMAIL);

            // Extract other fields specific to web design
            $phone = isset($_POST["web_phone"]) ? strip_tags(trim($_POST["web_phone"])) : '';
            $company = isset($_POST["web_company"]) ? strip_tags(trim($_POST["web_company"])) : '';
            $website_url = isset($_POST["web_website"]) ? strip_tags(trim($_POST["web_website"])) : '';
            $website_type = strip_tags(trim($_POST["web_website_type"]));
            $project_description = trim($_POST["web_project_description"]);
            $features = isset($_POST["features"]) ? $_POST["features"] : [];
            $pages = isset($_POST["web_pages"]) ? strip_tags(trim($_POST["web_pages"])) : '';
            $deadline = isset($_POST["web_deadline"]) ? strip_tags(trim($_POST["web_deadline"])) : '';
            $budget = isset($_POST["web_budget"]) ? strip_tags(trim($_POST["web_budget"])) : '';
            $additional_comments = isset($_POST["web_additional_comments"]) ? trim($_POST["web_additional_comments"]) : '';

            // Handle file uploads if any
            $uploaded_files = '';
            if (isset($_FILES['web_files']) && $_FILES['web_files']['error'][0] != UPLOAD_ERR_NO_FILE) {
                $upload_dir = 'uploads/';
                // Ensure the upload directory exists
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0755, true);
                }
                foreach ($_FILES['web_files']['tmp_name'] as $key => $tmp_name) {
                    $file_name = basename($_FILES['web_files']['name'][$key]);
                    $target_file = $upload_dir . $file_name;
                    // Optionally, add more validation for file types and sizes here
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $uploaded_files .= "Uploaded File: $file_name\n";
                    }
                }
            }

            // Validate required fields
            if (empty($name) || empty($email) || empty($website_type) || empty($project_description) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo "Please complete all required fields correctly.";
                exit;
            }

            // Set the email subject
            $subject = "New Web Design Quote Request from $name";

            // Build the email content
            $email_content = "Name: $name\n";
            $email_content .= "Email: $email\n";
            if (!empty($phone)) {
                $email_content .= "Phone Number: $phone\n";
            }
            if (!empty($company)) {
                $email_content .= "Company Name: $company\n";
            }
            if (!empty($website_url)) {
                $email_content .= "Current Website URL: $website_url\n";
            }
            $email_content .= "Website Type: $website_type\n";
            $email_content .= "Project Description:\n$project_description\n\n";
            $email_content .= "Features Needed: " . (!empty($features) ? implode(", ", $features) : "None") . "\n";
            $email_content .= "Number of Pages: " . ($pages ?: "Not specified") . "\n";
            $email_content .= "Desired Deadline: " . ($deadline ?: "Not specified") . "\n";
            $email_content .= "Estimated Budget: " . ($budget ?: "Not specified") . "\n";
            $email_content .= "Additional Comments:\n" . ($additional_comments ?: "None") . "\n";
            if (!empty($uploaded_files)) {
                $email_content .= "\n$uploaded_files";
            }

            // Build the email headers
            $email_headers = "From: $name <$email>\r\n";
            $email_headers .= "Reply-To: $email\r\n";
            $email_headers .= "MIME-Version: 1.0\r\n";
            $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        } elseif ($form_type === 'logo_design') {
            // Process Logo Design Quote Form
            $name = strip_tags(trim($_POST["logo_name"]));
            $name = str_replace(["\r", "\n"], [" ", " "], $name);

            $email = filter_var(trim($_POST["logo_email"]), FILTER_SANITIZE_EMAIL);

            // Extract other fields specific to logo design
            $phone = isset($_POST["logo_phone"]) ? strip_tags(trim($_POST["logo_phone"])) : '';
            $company = isset($_POST["logo_company"]) ? strip_tags(trim($_POST["logo_company"])) : '';
            $industry = strip_tags(trim($_POST["logo_industry"]));
            $preferred_style = strip_tags(trim($_POST["logo_style"]));
            $preferred_colors = strip_tags(trim($_POST["logo_colors"]));
            $logo_usage = strip_tags(trim($_POST["logo_usage"]));
            $inspiration = trim($_POST["logo_inspiration"]);
            $specific_ideas = trim($_POST["logo_ideas"]);
            $deadline = isset($_POST["logo_deadline"]) ? strip_tags(trim($_POST["logo_deadline"])) : '';
            $budget = isset($_POST["logo_budget"]) ? strip_tags(trim($_POST["logo_budget"])) : '';
            $additional_comments = isset($_POST["logo_additional_comments"]) ? trim($_POST["logo_additional_comments"]) : '';

            // Handle file uploads if any
            $uploaded_files = '';
            if (isset($_FILES['logo_files']) && $_FILES['logo_files']['error'][0] != UPLOAD_ERR_NO_FILE) {
                $upload_dir = 'uploads/';
                // Ensure the upload directory exists
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0755, true);
                }
                foreach ($_FILES['logo_files']['tmp_name'] as $key => $tmp_name) {
                    $file_name = basename($_FILES['logo_files']['name'][$key]);
                    $target_file = $upload_dir . $file_name;
                    // Optionally, add more validation for file types and sizes here
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $uploaded_files .= "Uploaded File: $file_name\n";
                    }
                }
            }

            // Validate required fields
            if (empty($name) || empty($email) || empty($industry) || empty($preferred_style) || empty($logo_usage) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo "Please complete all required fields correctly.";
                exit;
            }

            // Set the email subject
            $subject = "New Logo Design Quote Request from $name";

            // Build the email content
            $email_content = "Name: $name\n";
            $email_content .= "Email: $email\n";
            if (!empty($phone)) {
                $email_content .= "Phone Number: $phone\n";
            }
            if (!empty($company)) {
                $email_content .= "Company Name: $company\n";
            }
            $email_content .= "Industry: $industry\n";
            $email_content .= "Preferred Style: $preferred_style\n";
            $email_content .= "Preferred Colors: " . ($preferred_colors ?: "Not specified") . "\n";
            $email_content .= "Logo Usage: $logo_usage\n";
            $email_content .= "Inspiration & References:\n" . ($inspiration ?: "None") . "\n\n";
            $email_content .= "Specific Ideas or Symbols:\n" . ($specific_ideas ?: "None") . "\n\n";
            $email_content .= "Desired Deadline: " . ($deadline ?: "Not specified") . "\n";
            $email_content .= "Estimated Budget: " . ($budget ?: "Not specified") . "\n";
            $email_content .= "Additional Comments:\n" . ($additional_comments ?: "None") . "\n";
            if (!empty($uploaded_files)) {
                $email_content .= "\n$uploaded_files";
            }

            // Build the email headers
            $email_headers = "From: $name <$email>\r\n";
            $email_headers .= "Reply-To: $email\r\n";
            $email_headers .= "MIME-Version: 1.0\r\n";
            $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        } else {
            // Unknown form type
            http_response_code(400);
            echo "Unknown form type.";
            exit;
        }

        // Send the email
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (OK) response code and output a success message
            http_response_code(200);
            echo "Thank you! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code and output an error message
            http_response_code(500);
            echo "Oops! Something went wrong, and we couldn't send your message.";
        }

    } else {
        // reCAPTCHA failed
        http_response_code(400);
        echo "reCAPTCHA verification failed. Please try again.";
    }
} else {
    // Not a POST request, set a 403 (forbidden) response code and output a message
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>