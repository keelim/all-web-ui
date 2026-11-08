import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@keelim/all-web-ui';

export const AccountPicker = () => (
  <div style={{ width: 260 }}>
    <Select defaultOpen defaultValue="ira">
      <SelectTrigger aria-label="Account">
        <SelectValue placeholder="Choose an account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Retirement</SelectLabel>
          <SelectItem value="ira">Brokerage IRA</SelectItem>
          <SelectItem value="401k">Employer 401(k)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Taxable</SelectLabel>
          <SelectItem value="individual">Individual brokerage</SelectItem>
          <SelectItem value="joint">Joint account</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
