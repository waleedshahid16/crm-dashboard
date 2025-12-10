/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addCompany, updateCompany } from "../../store/slices/companiesSlice";
import { X, Upload, Building2, Plus } from "lucide-react";

const companySchema = yup
  .object({
    name: yup
      .string()
      .required("Company name is required")
      .min(2, "Name must be at least 2 characters"),
    industry: yup.string().required("Industry is required"),
    website: yup.string().url("Enter a valid URL").nullable(),
    companySize: yup.string().required("Company size is required"),
    annualRevenue: yup.string().required("Annual revenue is required"),
    status: yup
      .string()
      .oneOf(["Prospect", "Active", "Inactive"])
      .required("Status is required"),
    email: yup.string().email("Enter a valid email address").nullable(),
    phone1: yup.string().nullable(),
    phone2: yup.string().nullable(),
    fax: yup.string().nullable(),
    owner: yup.string().nullable(),
    source: yup.string().nullable(),
    tags: yup.array().of(yup.string()),
    description: yup.string().nullable(),
    emailOptOut: yup.boolean(),
  })
  .required();

const companyDefaultValues = {
  name: "",
  industry: "",
  website: "",
  companySize: "",
  annualRevenue: "",
  status: "Prospect",
  email: "",
  phone1: "",
  phone2: "",
  fax: "",
  owner: "",
  source: "Website",
  tags: [],
  description: "",
  emailOptOut: false,
  logo: "",
};

const AddCompanyModal = ({
  open,
  onClose,
  initialData = null,
  mode = "add",
}) => {
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: companyDefaultValues,
  });

  const tags = watch("tags") || [];
  const companyName = watch("name") || "";

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Media",
    "Transportation",
    "Other",
  ];

  const companySizes = [
    "1-10",
    "10-50",
    "50-200",
    "200-500",
    "500-1000",
    "1000+",
  ];

  const annualRevenues = [
    "Less than $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $50M",
    "$50M - $100M",
    "$100M+",
  ];

  const sources = [
    "Website",
    "Referral",
    "Social Media",
    "Email Campaign",
    "Cold Call",
    "Event",
    "Partner",
    "Other",
  ];

  const owners = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          ...companyDefaultValues,
          ...initialData,
        });
        if (initialData.logo) {
          setLogoPreview(initialData.logo);
        }
      } else {
        reset(companyDefaultValues);
        setLogoPreview(null);
      }
    }
  }, [open, initialData, reset]);

  const isEdit = mode === "edit" && initialData;

  const handleClose = () => {
    reset(companyDefaultValues);
    setLogoPreview(null);
    setTagInput("");
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 800 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setValue("logo", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be less than 800KB");
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToDelete)
    );
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        dispatch(updateCompany({ ...initialData, ...data }));
      } else {
        dispatch(addCompany(data));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f8faf9] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-blue-200 p-4 sm:p-6 text-[#2f362f]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 sm:border-3 border-[#2f362f] flex items-center justify-center text-xl sm:text-2xl font-bold overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate">
                  {isEdit ? "Edit Company" : "Add New Company"}
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 sm:mt-1 truncate">
                  {isEdit
                    ? "Update the company information"
                    : "Create a new company in your CRM system"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-[#f8faf9]">
          <div className="space-y-4 sm:space-y-6">
            {/* Logo Upload */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-[#BCC8BC] rounded-lg sm:rounded-xl bg-[#FEFDFC] flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                )}
              </div>
              <div className="w-full">
                <input
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label htmlFor="logo-upload" className="w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("logo-upload").click()
                      }
                      className="w-full sm:w-auto px-2.5 py-1.5 sm:py-2 bg-blue-200 hover:bg-blue-300 text-[#2f362f] rounded-md font-medium sm:font-semibold transition-all flex items-center justify-center gap-1.5 text-sm sm:text-base"
                    >
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Upload file</span>
                    </button>
                  </label>
                  <p className="text-xs text-[#2f362f] opacity-80">
                    JPG, GIF or PNG. Max 800K
                  </p>
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Acme Corporation"
                        className={`w-full px-2.5 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Email with Opt Out */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Email
                  </label>
                  <Controller
                    name="emailOptOut"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm text-[#2f362f]">
                          Email Opt-Out
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#FEFDFC] rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="email"
                        placeholder="info@acme.com"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Phone 1 */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Phone 1
                </label>
                <Controller
                  name="phone1"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-sm text-[#2f362f] pr-1">
                        <option>🇺🇸</option>
                      </select>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="tel"
                        placeholder="(201) 555-0123"
                        className="w-full pl-14 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Phone 2 */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Phone 2
                </label>
                <Controller
                  name="phone2"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-sm text-[#2f362f] pr-1">
                        <option>🇺🇸</option>
                      </select>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="tel"
                        placeholder="(201) 555-0123"
                        className="w-full pl-14 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Fax */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Fax
                </label>
                <Controller
                  name="fax"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      placeholder="Fax number"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Website
                </label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        value={field.value || ""}
                        placeholder="acme.com"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.website ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.website && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Reviews (placeholder) */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Reviews
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0-5"
                    className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ⭐
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Owner
                </label>
                <Controller
                  name="owner"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      value={field.value || ""}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select</option>
                      {owners.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="ml-1.5 text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag..."
                      className="flex-1 text-sm px-2.5 py-1.5 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tagInput.trim()) {
                          const newTags = [...tags, tagInput.trim()];
                          setValue("tags", [...new Set(newTags)]);
                          setTagInput("");
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-r-md hover:bg-blue-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Deals (placeholder) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Deals
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New
                  </button>
                </div>
                <select className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="">Select</option>
                  <option>Enterprise Software License</option>
                  <option>Cloud Infrastructure Setup</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {sources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.industry ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="companySize"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.companySize ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select Company Size</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      {errors.companySize && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.companySize.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Annual Revenue */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Annual Revenue <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="annualRevenue"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.annualRevenue ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select Annual Revenue</option>
                        {annualRevenues.map((revenue) => (
                          <option key={revenue} value={revenue}>
                            {revenue}
                          </option>
                        ))}
                      </select>
                      {errors.annualRevenue && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.annualRevenue.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-2.5 py-1.5 sm:py-2 text-sm sm:text-base border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Prospect">Prospect</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  )}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ""}
                      rows={4}
                      placeholder="Enter description"
                      className="w-full px-2.5 py-1.5 sm:py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 md:p-6 pt-4 border-t border-[#BCC8BC] flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-[#f8faf9]">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-[#2f362f] bg-white border border-[#BCC8BC] rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Company"
              : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
