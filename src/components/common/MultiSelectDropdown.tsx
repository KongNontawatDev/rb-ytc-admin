import React, { useState, useEffect } from "react";
import { Dropdown, Button, Checkbox, Input, Space, Tag, Flex, Spin } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";

interface DropdownOption {
  [key: string]: any;
}

interface MultiSelectDropdownProps {
  title?: string;
  selectedValues: string;
  setSelectedValues: (values: string) => void;
  options: DropdownOption[];
  loading: boolean;
  valueKey?: string;
  labelKey?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  title,
  selectedValues,
  setSelectedValues,
  options,
  loading,
  valueKey = "value",
  labelKey = "label",
}) => {
  const { t } = useTranslation("common");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (!loading && selectedValues) {
      setInternalSelected(
        selectedValues.split(",").map((val) => (!isNaN(Number(val)) ? Number(val) : val))
      );
    } else {
      setInternalSelected([]);
    }
  }, [selectedValues, loading]);

  const handleCheckboxChange = (checkedValues: (string | number)[]) => {
    setSelectedValues(checkedValues.join(","));
  };

  const handleSelectAll = () => {
    if (!loading) {
      setSelectedValues(options.map((opt) => opt[valueKey]).join(","));
    }
  };

  const handleClearSelection = () => {
    if (!loading) {
      setSelectedValues("");
      setSearchTerm("");
    }
  };

  const handleRemoveItem = (valueToRemove: string | number) => {
    const newValues = internalSelected.filter((val) => val !== valueToRemove);
    setSelectedValues(newValues.join(","));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const filteredOptions = loading
    ? []
    : options.filter((option) => option[labelKey]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

  const renderSelectedValues = () => {
    if (loading) return <Spin size="small" />;
    if (internalSelected.length === 0) return t("select", { data: title });

    if (internalSelected.length > 3) {
      return (
        <Space>
          <span>{t("select", { data: title })}:</span>
          <Tag color="blue">{t("selected", { data: internalSelected.length })}</Tag>
        </Space>
      );
    }

    return (
      <Flex>
        <span className="me-2">{t("select", { data: title })} :</span>
        {internalSelected.map((val) => {
          const option = options.find((opt) => opt[valueKey] === val);
          return (
            <Tag key={val} color={option?.color || "default"} closable onClose={() => handleRemoveItem(val)}>
              {option?.[labelKey] || "Unknown"}
            </Tag>
          );
        })}
      </Flex>
    );
  };

  return (
    <Dropdown
      trigger={["click"]}
      onOpenChange={handleOpenChange}
      open={open}
      dropdownRender={() => (
        <div style={{ padding: 8, width: 200, backgroundColor: "#fff", zIndex: 100000 }} className="shadow rounded">
          <Input
            size="small"
            placeholder={t("search", { data: title })}
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <Spin size="small" /> {t("loading")}
            </div>
          ) : filteredOptions.length > 0 ? (
            <Checkbox.Group
              value={internalSelected}
              onChange={handleCheckboxChange}
              className="flex flex-col mt-2"
            >
              {filteredOptions.map((option) => (
                <Checkbox key={option[valueKey]} value={option[valueKey]}>
                  {option[labelKey]}
                </Checkbox>
              ))}
            </Checkbox.Group>
          ) : (
            <div className="text-center mt-2">{t("noData", { data: title })}</div>
          )}
          <div className="flex justify-between mt-2">
            <Button size="small" type="text" onClick={handleSelectAll} disabled={loading}>
              {t("selectAll")}
            </Button>
            <Button size="small" type="text" onClick={handleClearSelection} disabled={loading}>
              {t("clear")}
            </Button>
          </div>
        </div>
      )}
    >
      <Button type="dashed" icon={<PlusCircleOutlined />}>{renderSelectedValues()}</Button>
    </Dropdown>
  );
};

export default MultiSelectDropdown;