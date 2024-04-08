import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Select category</CardTitle>
          <CardDescription>match</CardDescription>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger asChild>
              <Button>Select category</Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pr">p</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </>
  );
}
