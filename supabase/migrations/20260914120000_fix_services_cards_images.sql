-- Fix broken service card images in CMS content
-- Cards sc5-sc8 had non-existent image URLs (400 errors)
-- Updated with correct Supabase storage URLs

DO $$
DECLARE
  svc_id UUID;
BEGIN
  SELECT id INTO svc_id FROM pages WHERE slug = 'services';

  IF svc_id IS NOT NULL THEN
    UPDATE sections SET content = '{"cards": [{"id":"sc1","title":"Event Planning","description":"Full-service planning from concept to execution.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG"},{"id":"sc2","title":"Event Design & Styling","description":"Creative direction and aesthetic curation for your event.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181965-r5gizmmxm5.JPG"},{"id":"sc3","title":"Weddings & Celebrations","description":"Beautifully curated weddings and milestone celebrations.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237160878-xn7u6tvntc.JPG"},{"id":"sc4","title":"Corporate Events","description":"Professional conferences, summits, and corporate gatherings.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237172993-j8adyfkfn3k.JPG"},{"id":"sc5","title":"Production & Lighting","description":"Stage design, sound, lighting, and full production.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237070546-9s21riggcm4.JPG"},{"id":"sc6","title":"Catering & Hospitality","description":"Premium catering and guest experience management.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237096705-w9kp78n91ic.JPG"},{"id":"sc7","title":"Photography & Videography","description":"Professional coverage to capture every moment.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237076807-05xqnwil7gxb.JPG"},{"id":"sc8","title":"Private Events","description":"Exclusive birthday parties, anniversaries, and private gatherings.","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237097686-mxupl888xym.JPG"}]}'::jsonb
    WHERE page_id = svc_id AND section_type = 'services-cards';
  END IF;
END $$;
