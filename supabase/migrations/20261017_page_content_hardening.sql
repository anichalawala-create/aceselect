-- ================================================================
-- ACE SELECT CMS — Page-content production constraints
-- ================================================================

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_page_slug_format
    CHECK (page_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(page_slug) <= 80);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_key_format
    CHECK (content_key ~ '^[a-z0-9]+([._-][a-z0-9]+)*$' AND length(content_key) <= 120);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_media_url_format
    CHECK (
      media_url IS NULL
      OR media_url = ''
      OR media_url ~ '^(https?://[^[:space:]]+|/[^/[:space:]][^[:space:]]*)$'
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_text_has_no_media
    CHECK (content_type <> 'text' OR media_url IS NULL OR media_url = '');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

-- Media rows may use either value or media_url as their source URL. Empty
-- placeholders remain valid so editors can save a field before uploading.
DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_media_value_format
    CHECK (
      content_type = 'text'
      OR btrim(value) = ''
      OR value ~ '^(https?://[^[:space:]]+|/[^/[:space:]][^[:space:]]*)$'
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;
