drop policy "Enable read access for all users" on "public"."links";

create policy "Enable select for users"
on "public"."links"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = "user"));



