import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { AppBar, StepBadge } from "@/components/AppBar";
import { BottomActionBar } from "@/components/BottomActionBar";
import { DotGrid } from "@/components/DotGrid";
import { FloatingField } from "@/components/FloatingField";
import { FormCard } from "@/components/FormCard";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LocationPinIcon,
  LockIcon,
  UserIcon,
} from "@/components/Icon";
import { PhoneField } from "@/components/PhoneField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PrivacyNote } from "@/components/PrivacyNote";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader";
import { API_BASE_URL, ENDPOINTS } from "@/constants/api";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Nigerian states list ─────────────────────────────────────────────────────

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT",
];

// Fixed row height lets FlatList use getItemLayout, skipping expensive
// per-item measurement and making scroll-to-index instant.
const STATE_ITEM_H = 52;

// ─── State picker modal ───────────────────────────────────────────────────────

function StatePickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (state: string) => void;
}) {
  // 'use no memo' — this component has its own useState for `search`. Without
  // the directive, the React Compiler's per-module cache could alias this
  // component's search state with another component's state in the same module.
  "use no memo";

  const modalInsets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? NIGERIAN_STATES.filter((s) => s.toLowerCase().includes(q))
      : NIGERIAN_STATES;
  }, [search]);

  // Reset search every time the modal is dismissed so it reopens clean.
  const handleClose = useCallback(() => {
    setSearch("");
    onClose();
  }, [onClose]);

  const handleSelect = useCallback(
    (state: string) => {
      setSearch("");
      onSelect(state);
    },
    [onSelect],
  );

  // Fixed-height rows allow O(1) layout calculation instead of per-item measurement.
  const getItemLayout = useCallback(
    (_: ArrayLike<string> | null | undefined, index: number) => ({
      length: STATE_ITEM_H,
      offset: STATE_ITEM_H * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Pressable
        style={s.stateItem}
        onPress={() => handleSelect(item)}
        android_ripple={{ color: "#EEF3FF" }}
      >
        <LocationPinIcon size={16} color="#94A3B8" />
        <Text style={s.stateItemText}>{item}</Text>
      </Pressable>
    ),
    [handleSelect],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Semi-transparent backdrop — tapping it closes the modal */}
      <View style={s.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <View style={[s.sheet, { paddingBottom: modalInsets.bottom + 8 }]}>
          {/* Drag handle */}
          <View style={s.sheetHandle} />

          {/* Header row */}
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>State of Residence</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={s.sheetCloseBtn}>✕</Text>
            </Pressable>
          </View>

          {/* Search input */}
          <View style={s.searchWrap}>
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search states…"
              placeholderTextColor="#CBD5E1"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              // Unique nativeID so Fabric can track this input without
              // confusing it with any TextInput on the screen behind the modal.
              nativeID="state-search-input"
            />
          </View>

          {/* State list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            // Avoids an empty list flash when the search string narrows results.
            removeClippedSubviews={false}
          />
        </View>
      </View>
    </Modal>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────

function PasswordField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  // 'use no memo' — same reason as all other components that own useState in
  // this module: prevents React Compiler cache-slot aliasing across instances.
  "use no memo";

  const [show, setShow] = useState(false);

  // Stable renderIcon — a new function on every render would bypass
  // FloatingField's memo check and force a native prop update.
  const renderLockIcon = useCallback(
    (focused: boolean) => (
      <LockIcon size={20} color={focused ? "#1A56FF" : "#94A3B8"} />
    ),
    [],
  );

  // Stable toggle — prevents the Pressable inside the right slot from getting
  // a new onPress reference every time `show` changes.
  const toggleShow = useCallback(() => setShow((v) => !v), []);

  return (
    <FloatingField
      label="Password"
      value={value}
      placeholder="Create a password"
      onChangeText={onChangeText}
      secureTextEntry={!show}
      autoCapitalize="none"
      renderIcon={renderLockIcon}
      right={
        <Pressable onPress={toggleShow} hitSlop={8}>
          {show ? (
            <EyeSlashIcon size={20} color="#94A3B8" />
          ) : (
            <EyeIcon size={20} color="#94A3B8" />
          )}
        </Pressable>
      }
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd} / ${mm} / ${d.getFullYear()}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Step1PersonalInfo() {
  // 'use no memo' — opts this screen out of the React Compiler's per-module
  // cache. Without it, the compiler may share cache slots across this
  // component's state variables and those of sub-components in the same file.
  "use no memo";

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");

  // ── Submit state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Backend field mapping helpers ─────────────────────────────────────────────
  const buildRequestBody = useCallback(() => {
    const [day, month, year] = dob.split(" / ");
    const formattedDob = `${year}-${month}-${day}`;
    const cleanPhone = phone.startsWith("0") ? phone.slice(1) : phone;
    return {
      fullName: fullName.trim(),
      phoneNumber: `+234${cleanPhone}`,
      email: email.trim() || undefined,
      stateOfResidence: selectedState,
      dateOfBirth: formattedDob,
      password,
    };
  }, [fullName, phone, email, selectedState, dob, password]);

  const validate = useCallback(() => {
    if (!fullName.trim()) return "Full name is required";
    if (!phone.trim()) return "Phone number is required";
    if (phone.trim().length < 10) return "Enter a valid phone number";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address";
    }
    if (!selectedState) return "State of residence is required";
    if (!dob) return "Date of birth is required";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
  }, [fullName, phone, email, selectedState, dob, password]);

  const handleNext = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body = buildRequestBody();
      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.REGISTER_STEP1}`,
        body,
        { timeout: 30000 },
      );

      const { token, user } = response.data;

      await SecureStore.setItemAsync("authToken", token);
      if (user) {
        await SecureStore.setItemAsync("registrationUser", JSON.stringify(user));
      }

      router.push("/(auth)/register/step2" as any);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || "Registration failed. Please try again.");
        } else if (err.code === "ECONNABORTED") {
          setError("Request timed out. The server is taking too long to respond. Please try again.");
        } else {
          setError("Network error. Please check your connection and try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("[Register Step1 Error]", {
        message: err instanceof Error ? err.message : err,
        url: `${API_BASE_URL}${ENDPOINTS.REGISTER_STEP1}`,
        ...(axios.isAxiosError(err) && {
          code: err.code,
          status: err.response?.status,
          responseData: err.response?.data,
        }),
      });
    } finally {
      setLoading(false);
    }
  }, [validate, buildRequestBody, router]);

  // ── Picker visibility ────────────────────────────────────────────────────────
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ── Date picker internals ────────────────────────────────────────────────────
  // Age range: 18 – 100 years old. Computed once at mount.
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
  }, []);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d;
  }, []);

  // pickerDate tracks the in-progress selection inside the picker.
  // Initialised to 25 years ago — a sensible default scroll position.
  const [pickerDate, setPickerDate] = useState<Date>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d;
  });

  // ── Email validation ──────────────────────────────────────────────────────────
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ── Stable icon renderers (useCallback with [] so identity never changes) ─────
  const renderNameIcon = useCallback(
    (focused: boolean) => (
      <UserIcon size={20} color={focused ? "#1A56FF" : "#94A3B8"} />
    ),
    [],
  );

  const renderEmailIcon = useCallback(
    (focused: boolean) => (
      <EnvelopeIcon size={20} color={focused ? "#1A56FF" : "#94A3B8"} />
    ),
    [],
  );

  // Non-editable fields: isFocused is always false, so the icon colour is
  // always the unfocused grey. We ignore the `focused` arg intentionally.
  const renderStateIcon = useCallback(
    (_focused: boolean) => <LocationPinIcon size={20} color="#94A3B8" />,
    [],
  );

  const renderDobIcon = useCallback(
    (_focused: boolean) => <CalendarIcon size={20} color="#94A3B8" />,
    [],
  );

  // ── Stable right-slot elements ───────────────────────────────────────────────
  // useMemo so FloatingField's memo check doesn't see a new `right` reference
  // on every keystroke, avoiding unnecessary re-renders.
  const emailRightIcon = useMemo(
    () =>
      isEmailValid ? (
        <CheckCircleIcon size={20} color="#16A34A" />
      ) : undefined,
    [isEmailValid],
  );

  // These never change — created once, reused for every render.
  const stateRightIcon = useMemo(
    () => <ChevronDownIcon size={20} color="#94A3B8" />,
    [],
  );

  const dobRightIcon = useMemo(
    () => <ChevronDownIcon size={20} color="#94A3B8" />,
    [],
  );

  // ── State picker handlers ─────────────────────────────────────────────────────
  const openStatePicker = useCallback(() => setShowStatePicker(true), []);
  const closeStatePicker = useCallback(() => setShowStatePicker(false), []);

  const handleStateSelect = useCallback((state: string) => {
    setSelectedState(state);
    setShowStatePicker(false);
  }, []);

  // ── Date picker handlers ──────────────────────────────────────────────────────
  const openDatePicker = useCallback(() => setShowDatePicker(true), []);

  // Android: the picker dismisses itself after the user taps OK/Cancel.
  const onAndroidDateChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        setPickerDate(date);
        setDob(formatDate(date));
      }
    },
    [],
  );

  // iOS: spinner stays open while user scrolls — we only read the value
  // when the user taps "Done".
  const onIosDateChange = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      if (date) setPickerDate(date);
    },
    [],
  );

  const confirmIosDate = useCallback(() => {
    setDob(formatDate(pickerDate));
    setShowDatePicker(false);
  }, [pickerDate]);

  const cancelIosDate = useCallback(() => setShowDatePicker(false), []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // On iOS, 'padding' pushes the ScrollView content up when the keyboard
      // appears so the focused field stays visible. On Android the OS handles
      // this natively via windowSoftInputMode, so we leave it undefined.
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.screen}>
        <DotGrid id="dotsStep1" />

        <View style={{ height: insets.top }} />
        <AppBar
          title="Create Account"
          onBack={() => router.back()}
          right={<StepBadge label="1 of 3" />}
        />
        <ProgressBar progress="33.33%" label="Step 1 of 3" />

        {/*
         * keyboardShouldPersistTaps="handled" — lets the user tap a different
         * field or a Pressable inside the ScrollView without first having to
         * dismiss the keyboard with a tap on the background.
         */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionHeader
            eyebrow="PERSONAL INFO"
            title="Tell us about yourself"
            subtitle="Fill in your details exactly as they appear on your ID"
          />

          <FormCard style={s.card}>

            {/* ── Full Name ─────────────────────────────────────────────── */}
            <FloatingField
              label="Full Name"
              value={fullName}
              placeholder="e.g. Chukwuemeka Obi"
              onChangeText={setFullName}
              autoCapitalize="words"
              renderIcon={renderNameIcon}
            />

            {/* ── Phone Number ──────────────────────────────────────────── */}
            <PhoneField value={phone} onChangeText={setPhone} />

            {/* ── Email Address ─────────────────────────────────────────── */}
            <FloatingField
              label="Email Address"
              value={email}
              placeholder="Enter your email"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              renderIcon={renderEmailIcon}
              right={emailRightIcon}
            />

            {/* ── State of Residence ────────────────────────────────────────
             *
             * editable={false}  — prevents the keyboard from appearing.
             * onPress           — renders an absoluteFill Pressable overlay
             *                     inside FloatingField so the entire field
             *                     opens the state picker modal on tap.
             */}
            <FloatingField
              label="State of Residence"
              value={selectedState}
              placeholder="Select your state"
              onChangeText={() => {}}
              editable={false}
              onPress={openStatePicker}
              renderIcon={renderStateIcon}
              right={stateRightIcon}
            />

            {/* ── Date of Birth ─────────────────────────────────────────────
             *
             * Same editable={false} + onPress pattern as State above.
             * The value is formatted as DD / MM / YYYY to match the placeholder.
             */}
            <FloatingField
              label="Date of Birth"
              value={dob}
              placeholder="DD / MM / YYYY"
              onChangeText={() => {}}
              editable={false}
              onPress={openDatePicker}
              renderIcon={renderDobIcon}
              right={dobRightIcon}
            />

            {/* ── Password (last field) ─────────────────────────────────── */}
            <PasswordField value={password} onChangeText={setPassword} />

          </FormCard>

          <PrivacyNote
            text="Your information is encrypted and 100% secure"
            textStyle={s.privacyText}
          />
        </ScrollView>

        <BottomActionBar paddingBottom={insets.bottom + 8}>
          {error ? <Text style={s.errorText}>{error}</Text> : null}

          <PrimaryButton
            label={
              loading
                ? "Creating account..."
                : "Next — Identity Verification"
            }
            onPress={handleNext}
            disabled={loading}
            icon={
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ArrowRightIcon size={20} color="white" />
              )
            }
            iconPosition="right"
          />
        </BottomActionBar>

        {/* ── State picker modal ──────────────────────────────────────────── */}
        <StatePickerModal
          visible={showStatePicker}
          onClose={closeStatePicker}
          onSelect={handleStateSelect}
        />

        {/* ── Date picker — Android ───────────────────────────────────────────
         *
         * On Android, rendering DateTimePicker unconditionally when
         * showDatePicker is true causes it to display as a native dialog.
         * The dialog dismisses itself after the user taps OK or Cancel,
         * which calls onAndroidDateChange and sets showDatePicker=false.
         */}
        {Platform.OS === "android" && showDatePicker && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="default"
            onChange={onAndroidDateChange}
            maximumDate={maxDate}
            minimumDate={minDate}
          />
        )}

        {/* ── Date picker — iOS (bottom sheet modal) ──────────────────────────
         *
         * On iOS we render DateTimePicker in spinner mode inside a custom
         * bottom-sheet Modal so the user can Cancel or confirm with Done.
         * The Modal is always in the tree when Platform.OS==='ios' so React
         * doesn't unmount/remount it on each open; the `visible` prop controls
         * whether it's shown.
         */}
        {Platform.OS === "ios" && (
          <Modal
            visible={showDatePicker}
            animationType="slide"
            transparent
            onRequestClose={cancelIosDate}
            statusBarTranslucent
          >
            <View style={s.modalOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={cancelIosDate}
              />
              <View style={[s.sheet, s.dateSheet, { paddingBottom: insets.bottom + 8 }]}>
                <View style={s.sheetHandle} />
                <View style={s.sheetHeader}>
                  <Pressable onPress={cancelIosDate} hitSlop={12}>
                    <Text style={s.dateCancelBtn}>Cancel</Text>
                  </Pressable>
                  <Text style={s.sheetTitle}>Date of Birth</Text>
                  <Pressable onPress={confirmIosDate} hitSlop={12}>
                    <Text style={s.dateDoneBtn}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display="spinner"
                  onChange={onIosDateChange}
                  maximumDate={maxDate}
                  minimumDate={minDate}
                  // Explicit height prevents the spinner from collapsing on
                  // some iOS versions when rendered inside a Modal.
                  style={{ height: 216 }}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  content: { padding: 24, paddingBottom: 32 },
  card: { marginTop: 20, marginBottom: 20, gap: 16 },
  privacyText: { marginTop: 0 },

  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },

  // ── Modal shared ─────────────────────────────────────────────────────────────
  // Semi-transparent overlay that fills the screen. Content (the sheet) is
  // aligned to the bottom via justifyContent:'flex-end'.
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  // White bottom sheet shared by both state picker and iOS date picker.
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    // Caps height at 75% of the screen so a long state list doesn't cover
    // the entire screen. FlatList scrolls within this constrained height.
    maxHeight: "75%",
  },

  // iOS date picker sheet doesn't need maxHeight — content is a fixed-size
  // spinner (216 px) plus the header row.
  dateSheet: {
    maxHeight: undefined,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
  },

  sheetCloseBtn: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "600",
  },

  // ── State picker ─────────────────────────────────────────────────────────────
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  searchInput: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0D0D0D",
  },

  stateItem: {
    height: STATE_ITEM_H,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F1F5F9",
  },

  stateItemText: {
    fontSize: 15,
    color: "#0D0D0D",
  },

  // ── iOS date picker ───────────────────────────────────────────────────────────
  dateCancelBtn: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94A3B8",
  },

  dateDoneBtn: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A56FF",
  },
});
