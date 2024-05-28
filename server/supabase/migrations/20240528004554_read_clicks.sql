create policy "Allow read clicks for link owners"
on "public"."clicks"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT links."user"
   FROM links
  WHERE (links.id = clicks.link))));



